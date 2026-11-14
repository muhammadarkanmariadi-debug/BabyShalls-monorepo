'use client';

import React from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (rawDigits: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  prefix?: string;
  hidePrefix?: boolean;
  id?: string;
  ariaLabel?: string;
}

export function formatRupiahDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('id-ID');
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = '0',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  prefix = 'Rp',
  hidePrefix = false,
  id,
  ariaLabel,
}: CurrencyInputProps) {
  const displayValue = formatRupiahDigits(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      onChange('');
      return;
    }
    const normalized = String(Number(digits));
    onChange(normalized);
  };

  return (
    <div
      className={`flex items-center bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl overflow-hidden focus-within:border-[#D9744A] transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${className}`}
    >
      {!hidePrefix && (
        <span className="px-3 h-full flex items-center bg-[#FCF6EC] border-r border-[#EBDCCB] text-xs font-extrabold text-[#6B3F2A] select-none shrink-0">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        required={required}
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full h-[40px] px-3 bg-transparent text-xs font-semibold text-[#1A1A1A] focus:outline-none ${inputClassName}`}
      />
    </div>
  );
}

