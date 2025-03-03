import AchievementCard from "./AchievementCard/AchievementCard"
import { type IAwardsCheckList, type IAward, type IMinorIssue } from "types"

interface AchievementsDisplayProps {
  awards: IAward[]
  daysSinceLastCriticalError: number
  minorIssues: IMinorIssue[]
}

const getAwardsCheckList = (daysWithoutCriticalError: number, awards: IAward[]): IAwardsCheckList | null => {


  if ( awards && awards.length >= 1 ) {

    let now_playing: IAward = awards[0]!
    const next: Array<IAward | null> = []
  
    if ( awards.length > 0 && daysWithoutCriticalError < awards[0]!.days_required ) {
      now_playing = awards[0]!
      next.push(...awards.slice(1))
    } else if ( awards.length > 1 && daysWithoutCriticalError >= awards[0]!.days_required && daysWithoutCriticalError < awards[1]!.days_required ) {
      now_playing = awards[1]!
      next.push(...awards.slice(2))
    } else if ( awards.length > 2 && daysWithoutCriticalError >= awards[1]!.days_required) {
      now_playing = awards[2]!
    } else {
      now_playing = awards[awards.length - 1]!
    }

    return {
      now_playing: now_playing,
      next: next,
    }
  }

  return null

}

const AchievementsDisplay = ({ awards = [], daysSinceLastCriticalError = 0, minorIssues = [] }: AchievementsDisplayProps) => {

  // Select the award that is currently playing:
  const awardsList = getAwardsCheckList(daysSinceLastCriticalError, awards)
  const MAX_MINOR_ISSUES = Number(process.env.MAX_MINOR_ISSUES)

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
                daysSinceLastCriticalError={daysSinceLastCriticalError}
                award={awardsList.now_playing}
                state="unlocked"
                name={awardsList.now_playing.name}
                lost={ minorIssues && minorIssues.length >= MAX_MINOR_ISSUES }
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
                        daysSinceLastCriticalError={daysSinceLastCriticalError}
                        award={awardsList.next[index]!}
                        state={ awardsList.next.length - 1 === index ? "locked" : "upcoming" }
                        name={award.name}
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