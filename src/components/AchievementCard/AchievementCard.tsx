import { type IAward } from "types";
import Image from "next/image"
import clsx from "clsx";
import styles from "./AchievementCard.module.css";

interface AchievementCardProps {
  daysSinceLastCriticalError: number;
  award: IAward;
  name: string
  state: "locked" | "upcoming" | "unlocked"
}

const AchievementCard = ({ daysSinceLastCriticalError = 0, award, name, state = "unlocked" }: AchievementCardProps) => {

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
          ${ state === "unlocked" ?  `${styles.animatePulseScale}` : "" }
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
          />
        </div>

        <div className="flex flex-col">
          <span className="capitalize text-xs md:text-lg text-black">{ name }!</span>
          <p className="text-black text-[10px] md:text-base">{ `${award.days_required - daysSinceLastCriticalError} days to achieve ${award.description}!` }</p>
        </div>

      </div>
    </div>
  )

}

export default AchievementCard;