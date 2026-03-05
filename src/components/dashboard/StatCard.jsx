import React from 'react';

const StatCard = ({
  title,
  value,
  prefix = "",
  suffix = "",
  icon = null,
  trend = null,
  trendValue = null,
  loading = false,
  className = "",
  onClick = null,
}) => {
  // Handle null/undefined values safely
  const displayValue = value !== null && value !== undefined ? value : 0;
  
  // Format number with locale
  const formattedValue = typeof displayValue === 'number' 
    ? displayValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : displayValue;

  // Render loading state
  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Determine trend color
  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    if (trend === 'neutral') return 'text-gray-500';
    return 'text-gray-500';
  };

  // Determine trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    if (trend === 'neutral') return '→';
    return '';
  };

  return (
    <div 
      className={`
        bg-white dark:bg-slate-800 
        p-6 rounded-xl 
        shadow-sm 
        border border-gray-100 dark:border-slate-700
        transition-all duration-300
        hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role="article"
      aria-label={`${title} card`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          {icon && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              {icon}
            </div>
          )}
          
          {/* Title */}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(trend)}`}>
            <span>{getTrendIcon(trend)}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Value Section */}
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-gray-600 dark:text-gray-300 text-lg">{prefix}</span>}
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
          {formattedValue}
        </h3>
        {suffix && <span className="text-gray-600 dark:text-gray-300 text-lg">{suffix}</span>}
      </div>

      {/* Optional Subtext */}
      {value !== null && value !== undefined && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Updated just now
        </p>
      )}
    </div>
  );
};

export default StatCard;