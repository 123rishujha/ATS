export const formatSalary = (min, max) => {
  const formatNumber = (num) => {
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };
  return `₹${formatNumber(min)} - ₹${formatNumber(max)}`;
};
