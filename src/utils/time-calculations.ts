import { type ICriticalError } from "types";

export const daysDiff = (start_date_string: string, end_date_string: string) => {

  const startDateParts = start_date_string.split('-')
  const startDate = new Date(
    parseInt(startDateParts[0]!, 10),// Year
    parseInt(startDateParts[1]!, 10) - 1,// Month (0-indexed)
    parseInt(startDateParts[2]!, 10)// Day
  )

  const endDateParts = end_date_string.replace('/', '-').split('-');
  const endDate = new Date(
    parseInt(endDateParts[0]!, 10), // Year
    parseInt(endDateParts[1]!, 10) - 1, // Month (0-indexed)
    parseInt(endDateParts[2]!, 10)  // Day
  );

  const timeDifference = endDate.getTime() - startDate.getTime()

  const daysDifference = timeDifference / (1000 * 3600 * 24)

  return daysDifference

}

export const getElapsedDaysOfPeriod = (start_date: string, today: Date) => {

  // const today = new Date();

  // Get days of difference between today and start_date
  const daysElapsed = Math.floor((today.getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24));

  return daysElapsed;

}

export const getDaysSinceLastCriticalError = ( critical_errors: ICriticalError[], period_start_date: string, today: Date ): number | null => {

  const todayISO: string = today.toISOString().split('T')[0]!;

  // If no critical errors, just return the days elapsed in the current period
  if ( !critical_errors || critical_errors.length < 1 ) {
    const elapsedDays = getElapsedDaysOfPeriod(period_start_date, today)
    return elapsedDays
  }

  try {
    if (critical_errors && critical_errors.length >= 1) {
      let mostRecentItem = critical_errors[0]!
      let mostRecentDate = new Date(critical_errors[0]!.date)

      for(let i = 1; i < critical_errors.length; i++) {
        const currentDate = new Date(critical_errors[i]!.date)
        if (currentDate > mostRecentDate) {
          mostRecentDate = currentDate;
          mostRecentItem = critical_errors[i]!;
        }
      }

      const daysSinceLastCriticalError = daysDiff(mostRecentItem.date, todayISO)
      return daysSinceLastCriticalError
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return null
  }

  return null

}