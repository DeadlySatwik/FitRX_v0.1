export const formatDate = (date, options) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    console.warn("Invalid date passed to formatDate:", date);
    return "Invalid Date";
  }
  try {
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return "Error Date";
  }
};

export const getDayLabel = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    console.warn("Invalid date passed to getDayLabel:", date);
    return "Invalid";
  }
  const today = new Date();
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(date, { weekday: "short" });
};
