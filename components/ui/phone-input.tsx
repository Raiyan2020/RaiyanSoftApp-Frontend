import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTRIES, Country, DEFAULT_COUNTRY } from '@/lib/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  className = '',
  required = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [localNumber, setLocalNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const match = COUNTRIES.find((c) => value.startsWith(c.dial_code));
      if (match) {
        setSelectedCountry(match);
        setLocalNumber(value.replace(match.dial_code, ''));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when popover closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    updateValue(country.dial_code, localNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setLocalNumber(val);
    updateValue(selectedCountry.dial_code, val);
  };

  const updateValue = (dialCode: string, number: string) => {
    if (!number) {
      onChange('');
    } else {
      onChange(`${dialCode}${number}`);
    }
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dial_code.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef} dir="ltr" style={{ direction: 'ltr' }}>
      <div className="flex">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-l-xl border-r-0 px-3 py-3 text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shrink-0"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </button>

        <div className="bg-[var(--surface)] border-y border-[var(--border)] flex items-center justify-center px-2 text-[var(--text-muted)] text-sm font-mono select-none">
          {selectedCountry.dial_code}
        </div>

        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder="12345678"
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] border-l-0 rounded-r-xl py-3 px-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-left"
          required={required}
        />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-2 w-68 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Country Search Bar */}
            <div className="p-2 border-b border-[var(--border)] flex items-center gap-2 bg-[var(--surface-2)]">
              <Search size={14} className="text-[var(--text-muted)] shrink-0 ms-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full bg-transparent text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none py-1"
                autoFocus
              />
            </div>

            {/* Country List */}
            <div className="max-h-52 overflow-y-auto custom-scrollbar flex flex-col">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--surface-2)] transition-colors text-left border-b border-[var(--border)] last:border-0 ${
                      selectedCountry.code === c.code ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-xl shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--text)] font-medium truncate">{c.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] text-left">{c.dial_code}</div>
                    </div>
                    {selectedCountry.code === c.code ? <Check size={14} className="text-primary" /> : null}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                  No countries found.
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
