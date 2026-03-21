// components/FilterSelect.jsx
import React, { useId, useMemo } from "react";

const FilterSelect = React.memo(
  ({
    label = "Select",
    value = "",
    onChange = () => {},
    options = [],
    disabled = false,
    loading = false,
    placeholder = "Select an option",
    className = "",
  }) => {
    const id = useId();

    // ✅ Ensure options is always array
    const safeOptions = useMemo(() => (Array.isArray(options) ? options : []), [options]);

    // ✅ Prevent invalid value (React warning fix)
    const isValidValue = safeOptions.some((opt) => opt.value === value);
    const safeValue = isValidValue ? value : "";

    return (
      <div className="w-full">
        {/* LABEL */}
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-300 mb-2 tracking-tight"
        >
          {label}
        </label>

        {/* SELECT */}
        <div className="relative">
          <select
            id={id}
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || loading}
            aria-label={label}
            className={`
              w-full rounded-2xl px-5 py-3 pr-12
              bg-gray-800/60 backdrop-blur-xl
              border border-gray-700/50
              text-white text-sm font-medium
              shadow-md transition-all duration-200
              
              hover:border-gray-500
              focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500
              
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none cursor-pointer
              ${className}
            `}
          >
            {/* PLACEHOLDER */}
            {!loading && safeOptions.length > 0 && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* STATES */}
            {loading ? (
              <option value="">Loading...</option>
            ) : safeOptions.length === 0 ? (
              <option value="">No options available</option>
            ) : (
              safeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-gray-900 text-white"
                >
                  {option.label}
                </option>
              ))
            )}
          </select>

          {/* ICON */}
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = "FilterSelect";

export default FilterSelect;