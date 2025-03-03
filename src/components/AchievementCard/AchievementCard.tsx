import { type IAward } from "types";
import Image from "next/image"
import clsx from "clsx";
import styles from "./AchievementCard.module.css";

interface AchievementCardProps {
  daysSinceLastCriticalError: number;
  award: IAward;
  name: string
  state: "locked" | "upcoming" | "unlocked"
  lost?: boolean
}

const AchievementCard = ({ daysSinceLastCriticalError = 0, award, name, state = "unlocked", lost = false }: AchievementCardProps) => {

  const MAX_MINOR_ISSUES = Number(process.env.MAX_MINOR_ISSUES)

  return (
    <div className={clsx(
      state === "unlocked" ? styles.slideIn : "",
      state === "upcoming" ? styles.slideIn2 : "",
      state === "locked" ? styles.slideIn3 : "",
    )}>
      <div
        className={clsx(`
          flex bg-white opacity-100 border-4 border-solid border-black
          pr-[30px] pl-4 py-4 
          md:pr-[60px] md:pl-10 md:py-8
          gap-[19px]
          ${ state === "unlocked" && !lost ?  `${styles.animatePulseScale}` : state === "unlocked" && lost ? "opacity-40 scale-75 origin-top-right grayscale" : "" }
          ${ state === "upcoming" ? "opacity-60 scale-90 origin-top-right grayscale" : "" }
          ${ state === "locked" ? "opacity-40 scale-75 origin-top-right grayscale" : "" }
        `)}
        style={{
          boxShadow: `10px 10px 0px ${ state === "unlocked" ? "#6ddaa1" : "#000000" }`,
        }}
      >
        <div className="w-[74px] min-w-[74px] h-[70px] relative">
          <Image
            src={ award.icon! }
            alt="Reward star"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className={ lost ? "grayscale" : ""}
          />
        </div>

        <div className="flex flex-col">
          <span className={clsx("capitalize text-xs md:text-lg text-black", lost ? "text-gray-500" : "")}>{`${ name }!${ lost ? " (Lost)" : "" }`}</span>
          <p className={clsx("text-black text-[10px] md:text-base", lost ? "text-gray-500" : "")}>
            {
              lost ? 
              `This award is no longer available for this month due to the accumulation of ${MAX_MINOR_ISSUES} minor issues.`
              :
              `${award.days_required - daysSinceLastCriticalError} days to achieve ${award.description}!`
            }
          </p>
        </div>

      </div>
    </div>
  )

}

export default AchievementCard;