'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import metadata from 'libphonenumber-js/metadata.min.json';
import { useManagedCountriesQuery } from '@/features/settings';
import { translateMessage } from '@/lib/i18n-utils';
import { formatCallingCode } from '@/lib/utils';

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
      country: translateMessage('Country'),
      phone: translateMessage('Phone Number'),
    };
    const callingCodes: CountryCallingCodes = {};

    managedCountries.forEach((country) => {
      const countryCode = country.country_code?.trim().toUpperCase() as RPNInput.Country;
      // Skip codes libphonenumber doesn't know (e.g. "ZZ" from the admin countries API).
      if (!countryCode || !RPNInput.isSupportedCountry(countryCode) || countries.includes(countryCode)) return;

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

  // Country the input is currently formatting for. A ref (not state) because on a manual
  // country switch RPNInput calls onCountryChange (componentDidUpdate) right before it
  // emits the migrated value via onChange, and handlePhoneChange must see the new country.
  const countryRef = React.useRef<RPNInput.Country | undefined>(countryConfig.defaultCountry);
  const countriesKey = countryConfig.countries?.join(',') ?? 'all';
  const countriesKeyRef = React.useRef(countriesKey);
  if (countriesKeyRef.current !== countriesKey) {
    // RPNInput remounts (see `key` below) and starts from the new default country.
    countriesKeyRef.current = countriesKey;
    countryRef.current = countryConfig.defaultCountry;
  }

  // `limitMaxLength` trims typed/pasted digits, but RPNInput does not re-trim when the
  // country changes, so the migrated value is clamped here as well.
  const handlePhoneChange = React.useCallback(
    (nextValue?: string) => {
      onChange(limitPhoneValueByCountry(nextValue || '', countryRef.current));
    },
    [onChange]
  );

  const handleCountryChange = React.useCallback((country?: RPNInput.Country) => {
    countryRef.current = country;
  }, []);

  return (
    <RPNInput.default
      // RPNInput snapshots `countries` into state on mount but reads `countryOptionsOrder`
      // from live props; remount when the list changes so the two never diverge
      // (divergence makes sortCountryOptions emit `undefined` options).
      key={countriesKey}
      className={`flex w-full app-input rounded-xl min-h-11 transition-colors ${className}`}
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
      limitMaxLength
      smartCaret={false}
      // The selector already shows the calling code, so keep the input national-only:
      // an initial E.164 value renders as the national number, and a typed/pasted
      // "+<selected code>..." is converted to national instead of duplicating the code.
      // `value`/`onChange` stay E.164 for all callers.
      international={false}
      {...props}
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate', ...style }}
    />
  );
}

/** Clamps an E.164 value to the country's longest national significant number. */
function limitPhoneValueByCountry(value: string, country?: RPNInput.Country) {
  if (!value || !country) return value;

  const possibleLengths = phoneMetadata.countries[country]?.[3];
  if (!possibleLengths?.length) return value;

  const prefix = `+${RPNInput.getCountryCallingCode(country)}`;
  if (!value.startsWith(prefix)) return value;

  const maxLength = Math.max(...possibleLengths);
  const nationalDigits = value.slice(prefix.length);
  return nationalDigits.length > maxLength ? prefix + nationalDigits.slice(0, maxLength) : value;
}

const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', style, ...props }, ref) => (
    <input
      ref={ref}
      // i18n-ignore-next-line: phone input is pinned dir="ltr"; calling codes must not mirror
      className={`min-w-0 flex-1 bg-transparent border-0 rounded-r-xl py-2.5 pl-2 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none text-left ${className}`}
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
  options: (CountryEntry | undefined)[];
  onChange: (country: RPNInput.Country) => void;
  callingCodes?: CountryCallingCodes;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = options.filter((option): option is CountryEntry => {
    if (!option?.value) return false;
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
        onClick={() => (isOpen ? closeDropdown() : setIsOpen(true))}
        disabled={disabled}
        // i18n-ignore-next-line: phone input is pinned dir="ltr"; calling codes must not mirror
        className="flex h-full items-center gap-2 bg-transparent rounded-l-xl pl-4 pr-2 text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FlagComponent country={selectedCountry} countryName={selectedCountry} />
        <span className="text-xs font-mono text-[var(--text-muted)]">{selectedCallingCode}</span>
        <ChevronsUpDown size={14} className="text-[var(--text-muted)]" />
      </button>

      {isOpen ? (
        <div
          // i18n-ignore-next-line: phone input is pinned dir="ltr"; calling codes must not mirror
          className="absolute top-full left-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
        >
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
                      closeDropdown();
                    }}
                    // i18n-ignore-next-line: phone input is pinned dir="ltr"; calling codes must not mirror
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--surface-2)] transition-colors text-left border-b border-[var(--border)] last:border-0 ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                  >
                    <FlagComponent country={country.value} countryName={country.label} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--text)] font-medium truncate">{country.label}</div>
                      {/* i18n-ignore-next-line: phone input is pinned dir="ltr"; calling codes must not mirror */}
                      <div className="text-[11px] text-[var(--text-muted)] text-left">
                        {getDisplayCallingCode(country.value, callingCodes)}
                      </div>
                    </div>
                    {isSelected ? <Check size={14} className="text-primary" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                {translateMessage('No countries found.')}
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
    return formatCallingCode(managedCallingCode);
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
