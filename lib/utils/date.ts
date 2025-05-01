export function formatDate(date: Date) {
  return date.toLocaleDateString();
}

export function formatDateRelative(date: Date) {
  const now = new Date();
  
  // Check if dates are on different calendar days
  const isYesterday = (dateToCheck: Date, today: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.getDate() === dateToCheck.getDate() &&
           yesterday.getMonth() === dateToCheck.getMonth() &&
           yesterday.getFullYear() === dateToCheck.getFullYear();
  };
  
  // Check if it's today
  const isToday = (dateToCheck: Date, today: Date) => {
    return dateToCheck.getDate() === today.getDate() &&
           dateToCheck.getMonth() === today.getMonth() &&
           dateToCheck.getFullYear() === today.getFullYear();
  };
  
  if (isToday(date, now)) {
    return "Today";
  } else if (isYesterday(date, now)) {
    return "Yesterday";
  }
  
  // For older dates, continue with the existing logic
  // Difference in milliseconds
  const diffTime = Math.abs(now.getTime() - date.getTime());
  // Difference in days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return "1 week ago";
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else if (diffDays < 60) {
    return "1 month ago";
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  } else {
    return date.toLocaleDateString();
  }
}