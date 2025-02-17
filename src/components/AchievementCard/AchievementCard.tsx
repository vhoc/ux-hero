import { type Award } from "types";
import imgOutstanding from "../../../public/img/stars/outstanding.svg"
import imgRemarkable from "../../../public/img/stars/remarkable.svg"
import imgSpectacular from "../../../public/img/stars/spectacular.svg"
import Image from "next/image"
import { type StaticImport } from "next/dist/shared/lib/get-img-props"
import clsx from "clsx";
import styles from "./AchievementCard.module.css";

interface AchievementCardProps {
  daysElapsed: number;
  award: Award;
  type: "outstanding" | "remarkable" | "spectacular"
  state: "locked" | "upcoming" | "unlocked"
}

const AchievementCard = ({ daysElapsed, award, type = "outstanding", state = "unlocked" }: AchievementCardProps) => {

  const starsTable: Record<string, StaticImport> = {
    "outstanding": imgOutstanding as StaticImport,
    "remarkable": imgRemarkable as StaticImport,
    "spectacular": imgSpectacular as StaticImport,
  }

  const daysToUnlock = {
    "outstanding": 18,
    "remarkable": 48,
    "spectacular": 72,
  }


  return (
    <div
      className={clsx(`
        flex bg-white opacity-100 border-4 border-solid border-black
        pr-[60px] pl-10 py-8 gap-[19px]
        ${ state === "unlocked" ? styles.animatePulseScale : "" }
        ${ state === "upcoming" ? "opacity-60 scale-90 origin-top-right grayscale" : "" }
        ${ state === "locked" ? "opacity-40 scale-75 origin-top-right grayscale" : "" }
      `)}
      style={{
        boxShadow: `10px 10px 0px ${ state === "unlocked" ? "#6ddaa1" : "#000000" }`,
      }}
    >
      <div className="w-[74px] min-w-[74px] h-[70px] relative">
        <Image
          src={ starsTable[type]! }
          alt="Reward star"
          fill
          style={{
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>

      <div className="flex flex-col">
        <span className="capitalize text-lg text-black">{ type }!</span>
        <p className="text-black text-base">{ `${daysToUnlock[type] - daysElapsed} days to unlock. Get ${award.name}!` }</p>
      </div>

    </div>
  )

}

export default AchievementCard;