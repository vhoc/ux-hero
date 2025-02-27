import imgHeartFull from "@/../public/img/hearts/heart-full.png"
import imgHeartHalf from "@/../public/img/hearts/heart-half.png"
import imgHeartEmpty from "@/../public/img/hearts/heart-empty.png"
import Image from "next/image"
import { type IMinorIssue } from "types"
import styles from './Hearts.module.css';
import { type User } from "@supabase/supabase-js"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import AddMinorIssueButton from "@/components/AddMinorIssueButton/AddMinorIssueButton"

interface HeartsProps {
  minor_issues?: IMinorIssue[]
  userData?: User | null
}

// Maximum amount of minor issues accumulated in the current period before adding a critical error and resetting the counter.
const MAX_MINOR_ISSUES = Number(process.env.MAX_MINOR_ISSUES)

const Hearts = ({ minor_issues = [], userData }: HeartsProps) => {

  const numberOfIssues = minor_issues.length;
  const numberOfHearts = Number(MAX_MINOR_ISSUES / 2);

  const remainingHearts = Math.max(0, numberOfHearts - numberOfIssues / 2);

  const fullHearts = Math.floor(remainingHearts);
  const hasHalfHeart = remainingHearts % 1 !== 0;
  const emptyHearts = numberOfHearts - fullHearts - (hasHalfHeart ? 1 : 0);

  const lastFullHeartBeats = fullHearts > 0 && !hasHalfHeart;
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
              <div className="flex gap-4 items-center">

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

            <TooltipContent>
              <p className="text-center max-w-72 text-xs">
                Every minor issue detected will deal half a heart damage.
              </p>

              <p className="text-center max-w-72 text-xs mt-2">
                If you lose all your health, the counter will reset to ZERO.
              </p>

              <p className="text-center max-w-72 text-xs mt-2">
                Watch out!!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {
          userData ?
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <AddMinorIssueButton />
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p className="text-center max-w-72 text-xs">
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