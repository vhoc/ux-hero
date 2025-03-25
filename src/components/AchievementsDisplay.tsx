import AchievementCard from "./AchievementCard/AchievementCard"
import { type IAwardsCheckList, type IAward, type IIncident } from "types"

interface AchievementsDisplayProps {
  awards: IAward[]
  daysSinceLastCriticalError: number
  minorIssues: IIncident[]
  currentHealth: number
  today: Date
  period_end_date: string
}

const getAwardsCheckList = (daysWithoutCriticalError: number, awards: IAward[], today: Date, period_end_date: string): IAwardsCheckList | null => {

  if (!awards || awards.length === 0) {
    return null;
  }

  // Calculate remaining days in the period (assuming period ends March 31st)
  const currentDate = new Date(today); // Use current date as a parameter if needed
  const endOfPeriod = new Date(period_end_date); // March is month 2 (zero-based)

  // console.log("endOfPeriod", endOfPeriod)
  const remainingDays = Math.ceil((endOfPeriod.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

  let now_playing: IAward | null = null;
  const next: Array<IAward | null> = [];

  let foundNowPlaying = false;

  for (const award of awards) {
    // console.log("daysWithoutCriticalError: ", daysWithoutCriticalError)
    // console.log("award.days_required: ", award.days_required)
    // console.log("remainingDays: ", remainingDays)
    // console.log("(daysWithoutCriticalError + remainingDays): ", (daysWithoutCriticalError + remainingDays))
    // Check if the award is obtainable within the remaining days AND if daysWithoutCriticalError is enough
    if (daysWithoutCriticalError < award.days_required && award.days_required <= (daysWithoutCriticalError + remainingDays)) {      
      if (!foundNowPlaying) {
        now_playing = award;
        foundNowPlaying = true;
      } else {
        next.push(award);
      }
    }
  }

  if (!foundNowPlaying) {
    now_playing = null;
  }

  return {
    now_playing: now_playing,
    next: next,
  };
}



const AchievementsDisplay = ({ awards = [], daysSinceLastCriticalError = 0, minorIssues = [], currentHealth, today, period_end_date }: AchievementsDisplayProps) => {

  // Select the award that is currently playing:
  const awardsList = getAwardsCheckList(daysSinceLastCriticalError, awards, today, period_end_date)
  // console.log('awardsList: ', awardsList)
  // const MAX_MINOR_ISSUES = Number(process.env.MAX_MINOR_ISSUES)

  

  if (awardsList) {
    return (
      <div className="flex flex-col gap-y-10 px-6">

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
                daysSinceLastCriticalError={daysSinceLastCriticalError}
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
              <span className="text-white text-[13px] text-right">PLAY TU UNLOCK</span>
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
                        daysSinceLastCriticalError={daysSinceLastCriticalError}
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