import AchievementCard from "./AchievementCard/AchievementCard"
import { type IAwardsCheckList, type IAward, type IIncident, type IPeriod } from "types"
import { daysDiff, literalDaysDiff } from "@/utils/time-calculations"
import { arraysEqual } from "@/lib/utils"

interface AchievementsDisplayProps {
  awards: IAward[]
  daysSinceLastCriticalError: number
  minorIssues: IIncident[]
  currentHealth: number
  today: Date
  period_end_date: string
  current_period: IPeriod
}

const getAwardsCheckList = (daysWithoutCriticalError: number, awards: IAward[], today: Date, period_end_date: string, current_period: IPeriod): IAwardsCheckList | null => {

  if (!awards || awards.length === 0) {
    return null;
  }

  const current_period_achievements = [ current_period.achieved_1, current_period.achieved_2, current_period.achieved_3 ]

  // Logic to determine 'np' (now_playing) and 'next' awards
  let np: IAward | null = null;
  let next: IAward[] = [];

  if ( arraysEqual(current_period_achievements, [null, null, null]) ) {
    np = awards[0]!
    next = [awards[1], awards[2]] as IAward[]
  }

  if ( arraysEqual(current_period_achievements, [null, 1, null]) ) {
    np = awards[0]!
    next = [awards[1]] as IAward[]
  }

  if ( arraysEqual(current_period_achievements, [1, null, null]) ) {
    np = awards[1]!
    next = [ awards[2]] as IAward[]
  }

  if ( arraysEqual(current_period_achievements, [1, 2, null]) ) {
    np = awards[2]!
    next = []
  }

  if ( arraysEqual(current_period_achievements, [1, 1, null]) ) {
    np = awards[1]!
    next = []
  }

  if ( arraysEqual(current_period_achievements, [1, 1, 1]) ) {

  }

  if ( arraysEqual(current_period_achievements, [1, 1, null]) ) {
    np = awards[1]!
    next = []
  }  

  return {
    now_playing: np,
    next: next,
  }


}


const AchievementsDisplay = ({ awards = [], daysSinceLastCriticalError = 0, minorIssues = [], currentHealth, today, period_end_date, current_period }: AchievementsDisplayProps) => {


  // Select the award that is currently playing:
  const awardsList = getAwardsCheckList(daysSinceLastCriticalError, awards, today, period_end_date, current_period)
  // Get the amount of days left of the current month. Parameters are strings.
  // const daysLeftInMonth = daysDiff(today.toISOString(), new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString())
  const award_days_required = daysDiff(current_period.start_date, current_period.end_date) - 1
  // console.log("daysLeftInMonth", daysLeftInMonth)

  const start_period_date = new Date(current_period.start_date)
  // console.log("start_period_date", start_period_date)
  // console.log("test: ", new Date(start_period_date.getFullYear(), start_period_date.getMonth() + 1, -1).toISOString())
  // const fakeDate = new Date(2025, 3, 1)
  // console.log("fakeDate", fakeDate)
  
  // Get the days left from today to the end of the first month of current_period.*:
  // const daysLeftToFirstMonthEnd = literalDaysDiff(fakeDate, new Date(start_period_date.getFullYear(), start_period_date.getMonth() + 1, 0))
  // Get the days left from today to the end of the second month of current_period.*:
  // const daysLeftToSecondMonthEnd = literalDaysDiff(fakeDate, new Date(start_period_date.getFullYear(), start_period_date.getMonth() + 2, 0))
  // Get the days left from today to the end of the third month of current_period.*:
  // const daysLeftToThirdMonthEnd = literalDaysDiff(fakeDate, new Date(start_period_date.getFullYear(), start_period_date.getMonth() + 3, 0))
  // console.log("daysLeftToFirstMonthEnd", daysLeftToFirstMonthEnd)
  // console.log("daysLeftToSecondMonthEnd", daysLeftToSecondMonthEnd)
  // console.log("daysLeftToThirdMonthEnd", daysLeftToThirdMonthEnd)

  if (awardsList) {
    return (
      <div className="flex flex-col gap-y-10 px-16">

        {/* NOW PLAYING */}
        <div
          className="flex flex-col gap-y-[21px] mt-[34px]"
        >

          <span className="text-white text-[13px] text-right">NOW PLAYING</span>
          {
            awardsList.now_playing ?
              <AchievementCard
                award={awardsList.now_playing}
                state="unlocked"
                name={awardsList.now_playing.name}
                currentHealth={currentHealth}
                isNowPlaying={true}
                award_days_required={award_days_required}
                daysSinceLastCriticalError={daysSinceLastCriticalError}
                start_period_date={start_period_date}
                // bonus_status={ minorIssues && minorIssues.length >= MAX_MINOR_ISSUES ? "lost" : "full" }
                // lost={ minorIssues && minorIssues.length >= MAX_MINOR_ISSUES }
              />
              :
              null
          }


        </div>

        {/* PLAY TO UNLOCK */}
        {
          awardsList.next.length > 0 ?
            <div
              className="flex flex-col gap-y-[13px] mt-[35px] items-end"
            >
              <span className="text-white text-[13px] text-right">PLAY TO UNLOCK</span>
              <div className="w-full mr-0">
              {
                awardsList.next.map((award, index) => {
                  if (award) {
                    return (
                      <AchievementCard
                        key={`next-award-${index}_${award.id}`}
                        award={awardsList.next[index]!}
                        state={ awardsList.next.length - 1 === index ? "locked" : "upcoming" }
                        name={award.name}
                        currentHealth={currentHealth}
                        award_days_required={award_days_required}
                        daysSinceLastCriticalError={daysSinceLastCriticalError}
                        start_period_date={start_period_date}
                      />
                    )
                  }

                  return null
                })
              }
              </div>


            </div>
            :
            null
        }


      </div>
    )
  }

  return (
    <div>
      No awards found
    </div>
  )

}

export default AchievementsDisplay