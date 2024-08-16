export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1); // JavaScript months are 0-based
  return date.toLocaleString("default", { month: "short" });
}

export function getDayName(day: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day % 7];
}
