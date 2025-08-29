// Utility functions for formatting and data manipulation

// Number formatting function for Kwacha
export const formatKwacha = (value) => {
  return new Intl.NumberFormat("en-MW", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Additional utility functions can be added here
export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`
}

export const formatNumber = (value) => {
  return new Intl.NumberFormat().format(value)
}
