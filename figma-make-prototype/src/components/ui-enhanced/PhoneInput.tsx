/**
 * PhoneInput - Enhanced phone number input with country code
 * Inspired by: https://uiverse.io/Yaya12085/hungry-goat-59
 */

import React from 'react';
import { Phone } from 'lucide-react';
import { FormLabel } from './FormLabel';

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

// Common African country codes
const africanCountryCodes = [
  { code: '+234', country: 'NG', name: 'Nigeria' },
  { code: '+254', country: 'KE', name: 'Kenya' },
  { code: '+27', country: 'ZA', name: 'South Africa' },
  { code: '+233', country: 'GH', name: 'Ghana' },
  { code: '+256', country: 'UG', name: 'Uganda' },
  { code: '+255', country: 'TZ', name: 'Tanzania' },
  { code: '+250', country: 'RW', name: 'Rwanda' },
  { code: '+251', country: 'ET', name: 'Ethiopia' },
  { code: '+225', country: 'CI', name: "Côte d'Ivoire" },
  { code: '+237', country: 'CM', name: 'Cameroon' },
  { code: '+221', country: 'SN', name: 'Senegal' },
  { code: '+243', country: 'CD', name: 'DR Congo' },
  { code: '+263', country: 'ZW', name: 'Zimbabwe' },
  { code: '+260', country: 'ZM', name: 'Zambia' },
];

export function PhoneInput({
  label,
  value,
  onChange,
  countryCode = '+234',
  onCountryCodeChange,
  placeholder = '8012345678',
  required = false,
  error
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <FormLabel required={required} variant="floating">
          {label}
        </FormLabel>
      )}
      
      <div className={`
        flex items-center gap-2 bg-[#1A1A20] border-2 rounded-xl
        transition-all duration-300 overflow-hidden
        ${isFocused ? 'border-[#1CE479] shadow-[0_0_15px_rgba(28,228,121,0.2)]' : 'border-[#2A2A35]'}
        ${error ? 'border-[#FF4444]' : ''}
        hover:border-[#1CE479]/50
      `}>
        {/* Phone Icon */}
        <div className="pl-4 text-[#1CE479]">
          <Phone className="w-5 h-5" />
        </div>

        {/* Country Code Selector */}
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange?.(e.target.value)}
          className="bg-transparent border-r-2 border-[#2A2A35] px-2 py-3 text-foreground focus:outline-none cursor-pointer min-w-[80px]"
        >
          {africanCountryCodes.map((country) => (
            <option key={country.code} value={country.code} className="bg-[#1A1A20]">
              {country.code}
            </option>
          ))}
        </select>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {error && (
        <p className="text-sm text-[#FF4444] mt-1">{error}</p>
      )}
    </div>
  );
}
