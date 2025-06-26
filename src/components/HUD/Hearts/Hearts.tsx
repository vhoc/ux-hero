import imgHeartFull from "@/../public/img/hearts/heart-full.png"
import imgHeartHalf from "@/../public/img/hearts/heart-half.png"
import imgHeartEmpty from "@/../public/img/hearts/heart-empty.png"
import Image from "next/image"
import { type ISingleMonthPeriod } from "types"
import styles from './Hearts.module.css';
import { type User } from "@supabase/supabase-js"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import AddIncidentButton from "@/components/AddIncidentButton/AddIncidentButton"

interface HeartsProps {
  health: number
  today: Date
  userData?: User | null
  currentMonthPeriod: ISingleMonthPeriod
}

// Maximum amount of minor issues accumulated in the current period before adding a critical error and resetting the counter.
const MAX_INCIDENTS = Number(process.env.MAX_INCIDENTS)

// The total number of hearts to display
const NUMBER_OF_HEARTS = MAX_INCIDENTS / 2; // = 4

const Hearts = ({ health = 0, today, userData, currentMonthPeriod }: HeartsProps) => {

  const period = currentMonthPeriod

  // const numberOfIncidents = incidents.length;
  // const numberOfIncidents = Number(MAX_INCIDENTS - (health + 1))
  // console.log('numberOfIncidents: ', numberOfIncidents)
  
  // const numberOfHearts = Number(MAX_INCIDENTS / 2);

  // const remainingHearts = Math.max(0, numberOfHearts - numberOfIncidents / 2);

  const fullHearts = Math.floor(health / 2);
  // const hasHalfHeart = remainingHearts % 1 !== 0;
  const hasHalfHeart = health % 2 !== 0; // Check for a remainder (1 for odd numbers)
  // const emptyHearts = numberOfHearts - fullHearts - (hasHalfHeart ? 1 : 0);
  const emptyHearts = Math.max( 0, NUMBER_OF_HEARTS - fullHearts - (hasHalfHeart ? 1 : 0) );

  // const lastFullHeartBeats = fullHearts > 0 && !hasHalfHeart;
  const lastFullHeartBeats = fullHearts > 0 && !hasHalfHeart;
  // const halfHeartBeats = hasHalfHeart;
  const halfHeartBeats = hasHalfHeart;

  

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">HEALTH</span>
      </div>


      <div className="flex gap-4 items-center">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-4 items-center flex-wrap">

                {Array(fullHearts)
                  .fill(null)
                  .map((_, index) => (
                    <Image
                      key={`full-heart-${index}`}
                      src={imgHeartFull}
                      alt="Full Heart"
                      width={49}
                      height={49}
                      className={`w-[49px] h-[49px] ${index === fullHearts - 1 && lastFullHeartBeats ? styles.animateBeat : ""
                        }`}
                    />
                  ))}

                {hasHalfHeart && (
                  <Image
                    src={imgHeartHalf}
                    alt="Half Heart"
                    width={49}
                    height={49}
                    className={`w-[49px] h-[49px] ${halfHeartBeats ? styles.animateBeat : ""}`}
                  />
                )}

                {Array(emptyHearts)
                  .fill(null)
                  .map((_, index) => (
                    <Image
                      key={`empty-heart-${index}`}
                      src={imgHeartEmpty}
                      alt="Empty Heart"
                      width={49}
                      height={49}
                      className="w-[49px] h-[49px]"
                    />
                  ))}

              </div>
            </TooltipTrigger>

            <TooltipContent side="bottom" className="py-4">
              <p className="text-center max-w-72 md:max-w-md text-xs">
                Health decreases half a heart for every minor issue reported.
              </p>

              <p className="text-center max-w-72 md:max-w-md text-xs mt-2">
                If you lose all your health, the current award will be lost.
              </p>

              <p className="text-center max-w-72 md:max-w-md text-xs mt-2">
                Health will be replenished at the start of the next month.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {
          userData && health >= 1 ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <AddIncidentButton today={today} period={period} />
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p className="text-center max-w-72 md:max-w-md text-xs">
                    Register a minor issue in the database.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            :
            null
        }


      </div>
    </div>

  )

}

export default Hearts