function getLastDayOfCurrentYear(): Date {
  const currentYear = new Date().getFullYear();
  const lastDay = new Date(currentYear, 11, 31);
  return lastDay;
}

function getLastDayOfYear(year: number): Date {
  const lastDay = new Date(year, 11, 31);
  return lastDay;
}

const getActualLocalDate = () => {
  const date = new Date();
  return date;
}

const DateUtils = {
  getLastDayOfCurrentYear,
  getLastDayOfYear,
  getActualLocalDate
};

export default DateUtils;
