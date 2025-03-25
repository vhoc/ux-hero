import { type IAward, type IPeriod } from "types"

/**
 * Returns the accumulated award pot for the given period
 * 
 * @param awards 
 * @param period 
 * @returns 
 */
export const calculateAwardPot = (awards: IAward[], period: IPeriod): number => {
  const awardsWithoutIcons = awards.map(award => {
    return {
      ...award,
      icon: undefined,
      icon_small: undefined
    }
  })

  let totalAwardPot = 0;

  for (let i = 1; i <= 3; i++) { // Iterate through achieved_1, achieved_2, achieved_3
    const achievedId = period[`achieved_${i}` as keyof IPeriod];
    const healthValue = period[`health_${i}` as keyof IPeriod] as number;

    if (achievedId !== null && achievedId !== undefined) { // Check if achievedId is valid (not null or undefined)
      const award = awardsWithoutIcons.find(award => award.id === achievedId);

      if (award) {
        let awardValue = award.value;

        if (healthValue >= 1 && healthValue <= 4) {
          awardValue /= 2; // Reduce by half
        } else if (healthValue === 0) {
          awardValue = 0; // Set to zero
        } // else if (healthValue >= 5 && healthValue <= 8) { // No change needed }

        totalAwardPot += awardValue;
      }
    }
  }

  return totalAwardPot;


}
// export const calculateAwardPot = ( daysSinceLastCriticalError: number, awards: IAward[], period: IPeriod ): number => {

//   // Create new array from awards without the icon and icon_small properties
//   const awardsWithoutIcons = awards.map(award => {
//     return {
//       ...award,
//       icon: undefined,
//       icon_small: undefined
//     }
//   })

//   // console.log("awardsWithoutIcons: ", awardsWithoutIcons)

//   // Order awardsWithoutIcons by days_required ascending into a new array
//   const awardsList = awardsWithoutIcons.sort((a, b) => a.days_required - b.days_required)

//   // console.log("awardsList: ", awardsList)

//   let result_month_1 = 0
//   let result_month_2 = 0
//   let result_month_3 = 0

//   if ( daysSinceLastCriticalError && period && awardsList && awardsList.length >= 3 ) {

//     // console.log("Data: ", JSON.stringify({ daysSinceLastCriticalError, awardsList, period }, null, 2))

//     // Between 30 and 59 days
//     if ( daysSinceLastCriticalError >= awardsList[0]!.days_required  ) {
//       result_month_1 =
//         // Health of the 1st month of the period determines the award value
//         period.health_1 >= 5  ? awardsList[0]!.value :
//         period.health_1 >= 1 && period.health_1 < 5 ? awardsList[0]!.value / 2 : 0
//     }

//     // Between 60 and 89 days
//     if ( daysSinceLastCriticalError >= awardsList[1]!.days_required  ) {
//       result_month_2 =
//         // Health of the 2nd month of the period determines the award value
//         period.health_2 >= 5 ? awardsList[1]!.value :
//         period.health_2 >= 1 && period.health_2 < 5 ? awardsList[1]!.value / 2 : 0
//     }

//     // Between 90 days and more
//     if ( daysSinceLastCriticalError >= awardsList[2]!.days_required  ) {
//       result_month_3 =
//         // Health of the 2nd month of the period determines the award value
//         period.health_3 >= 5 ? awardsList[2]!.value :
//         period.health_3 >= 1 && period.health_3 < 5 ? awardsList[2]!.value / 2 : 0
//     }

//     return result_month_1 + result_month_2 + result_month_3

//   }

//   return 0

// }

/**
 * Returns the number of the month of a quarter caltulated from the imput date
 * 
 * @param date 
 * @returns 
 */
export const calculateMonthOfQuarter = (date: Date): number => {

  if (isNaN(date.getTime())) {
    // Invalid date
    return 0
  }

  const month = date.getMonth()

  // Determine the quarter and calculate the month within the quarter
  const monthInQuarter = (month % 3) + 1
  // const monthInQuarter = (month % 3)

  return monthInQuarter
}

/**
 * Returns the current period of the given date
 * 
 * @param today 
 * @param periods 
 * @returns 
 */
export const calculateCurrentPeriod = (today: Date, periods: IPeriod[]): IPeriod | null => {
  const todayISO = today.toISOString()

  const currentPeriod = periods.find(period => period.start_date <= todayISO && period.end_date >= todayISO)

  return currentPeriod ?? null
}

/**
 * Returns the type of the bonus earned based on the current health
 *  
 * @param currentHealth 
 * @returns 
 */
export const calculateBonusStatus = (currentHealth: number) => {
  // If currentHealth is between 1 and 4, return "half", if currentHealth is equal or greater than 5, return "full", otherwise return "lost"
  return currentHealth >= 5 ? "full" : currentHealth >= 1 && currentHealth < 5 ? "half" : "lost"
}