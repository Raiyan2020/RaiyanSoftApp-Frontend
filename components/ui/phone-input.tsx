'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import metadata from 'libphonenumber-js/metadata.min.json';
import { useManagedCountriesQuery } from '@/features/settings';
import { translateMessage } from '@/lib/i18n-utils';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: RPNInput.Country;
  useManagedCountries?: boolean;
};

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountryCallingCodes = Partial<Record<RPNInput.Country, string>>;
type CountryMetadata = [
  string,
  string,
  string,
  number[]?,
  unknown?,
  string?,
];

const phoneMetadata = metadata as {
  countries: Partial<Record<RPNInput.Country, CountryMetadata>>;
};

export default function PhoneInput({
  value,
  onChange,
  className = '',
  defaultCountry = 'KW',
  useManagedCountries = true,
  style,
  ...props
}: PhoneInputProps) {
  const { data: managedCountries } = useManagedCountriesQuery({ enabled: useManagedCountries });
  const [selectedCountry, setSelectedCountry] = React.useState<RPNInput.Country | undefined>(
    defaultCountry
  );

  const countryConfig = React.useMemo(() => {
    if (!managedCountries?.length) {
      return {
        countries: undefined,
        labels: undefined,
        callingCodes: {},
        defaultCountry,
      };
    }

    const countries: RPNInput.Country[] = [];
    const labels: RPNInput.Labels = {
      country: 'Country',
      phone: 'Phone number',
    };
    const callingCodes: CountryCallingCodes = {};

    managedCountries.forEach((country) => {
      const countryCode = country.country_code?.trim().toUpperCase() as RPNInput.Country;
      if (!countryCode || countries.includes(countryCode)) return;

      countries.push(countryCode);
      labels[countryCode] = country.name;
      callingCodes[countryCode] = country.phone_code?.trim() || '';
    });

    return {
      countries,
      labels,
      callingCodes,
      defaultCountry: countries.includes(defaultCountry) ? defaultCountry : countries[0] ?? defaultCountry,
    };
  }, [defaultCountry, managedCountries]);

  React.useEffect(() => {
    setSelectedCountry((currentCountry) => currentCountry ?? countryConfig.defaultCountry);
  }, [countryConfig.defaultCountry]);

  const handlePhoneChange = React.useCallback(
    (nextValue?: string) => {
      const limitedValue = limitPhoneValueByCountry(
        nextValue || '',
        selectedCountry ?? countryConfig.defaultCountry
      );

      onChange(limitedValue);
    },
    [countryConfig.defaultCountry, onChange, selectedCountry]
  );

  const handleCountryChange = React.useCallback(
    (country?: RPNInput.Country) => {
      setSelectedCountry(country);

      if (country && value) {
        const limitedValue = limitPhoneValueByCountry(value, country);
        if (limitedValue !== value) {
          onChange(limitedValue);
        }
      }
    },
    [onChange, value]
  );

  return (
    <RPNInput.default
      className={`flex w-full ${className}`}
      value={value || undefined}
      onChange={handlePhoneChange}
      onCountryChange={handleCountryChange}
      defaultCountry={countryConfig.defaultCountry}
      countries={countryConfig.countries}
      countryOptionsOrder={countryConfig.countries}
      labels={countryConfig.labels}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      countrySelectProps={{ callingCodes: countryConfig.callingCodes }}
      inputComponent={InputComponent}
      smartCaret={false}
      {...props}
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate', ...style }}
    />
  );
}

function limitPhoneValueByCountry(value: string, country?: RPNInput.Country) {
  if (!value || !country) return value;

  const maxNationalLength = getMaxNationalLength(country);
  if (!maxNationalLength) return value;

  const callingCode = RPNInput.getCountryCallingCode(country);
  const digits = value.replace(/\D/g, '');
  const nationalDigits = digits.startsWith(callingCode)
    ? digits.slice(callingCode.length)
    : digits;

  if (nationalDigits.length <= maxNationalLength) return value;

  return `+${callingCode}${nationalDigits.slice(0, maxNationalLength)}`;
}

function getMaxNationalLength(country: RPNInput.Country) {
  const countryMetadata = phoneMetadata.countries[country];
  const possibleLengths = countryMetadata?.[3];

  if (!possibleLengths?.length) return undefined;

  const maxLength = Math.max(...possibleLengths);
  const nationalPrefix = countryMetadata?.[5];

  return nationalPrefix === '0' ? maxLength + 1 : maxLength;
}

const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', style, ...props }, ref) => (
    <input
      ref={ref}
      className={`min-w-0 flex-1 bg-[var(--surface)] border border-[var(--border)] border-l-0 rounded-r-xl py-3 px-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-left ${className}`}
      {...props}
      dir="ltr"
      style={{
        direction: 'ltr',
        textAlign: 'left',
        unicodeBidi: 'plaintext',
        ...style,
      }}
    />
  )
);
InputComponent.displayName = 'InputComponent';

function CountrySelect({
  disabled,
  value: selectedCountry,
  options,
  onChange,
  callingCodes = {},
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
  callingCodes?: CountryCallingCodes;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCountries = options.filter((option) => {
    if (!option.value) return false;
    const callingCode = getDisplayCallingCode(option.value, callingCodes);
    const query = searchQuery.toLowerCase();

    return (
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      callingCode.replace('+', '').includes(searchQuery.replace('+', ''))
    );
  });

  const selectedCallingCode = selectedCountry
    ? getDisplayCallingCode(selectedCountry, callingCodes)
    : '';

  return (
    <div
      className="relative shrink-0"
      ref={containerRef}
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className="flex h-full items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-l-xl border-r-0 px-3 py-3 text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FlagComponent country={selectedCountry} countryName={selectedCountry} />
        <span className="text-xs font-mono text-[var(--text-muted)]">{selectedCallingCode}</span>
        <ChevronsUpDown size={14} className="text-[var(--text-muted)]" />
      </button>

      {isOpen ? (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-[var(--border)] flex items-center gap-2 bg-[var(--surface-2)]">
            <Search size={14} className="text-[var(--text-muted)] shrink-0 ms-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={translateMessage('Search country...')}
              className="w-full bg-transparent text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none py-1"
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left' }}
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                if (!country.value) return null;
                const isSelected = selectedCountry === country.value;

                return (
                  <button
                    key={country.value}
                    type="button"
                    onClick={() => {
                      onChange(country.value as RPNInput.Country);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--surface-2)] transition-colors text-left border-b border-[var(--border)] last:border-0 ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                  >
                    <FlagComponent country={country.value} countryName={country.label} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--text)] font-medium truncate">{country.label}</div>
                      <div className="text-[10px] text-[var(--text-muted)] text-left">
                        {getDisplayCallingCode(country.value, callingCodes)}
                      </div>
                    </div>
                    {isSelected ? <Check size={14} className="text-primary" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                No countries found.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getDisplayCallingCode(country: RPNInput.Country, callingCodes: CountryCallingCodes) {
  const managedCallingCode = callingCodes[country];
  if (managedCallingCode) {
    return managedCallingCode.startsWith('+') ? managedCallingCode : `+${managedCallingCode}`;
  }

  return `+${RPNInput.getCountryCallingCode(country)}`;
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = country ? flags[country] : null;

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-[var(--surface-2)] [&_svg]:size-full">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  );
}
