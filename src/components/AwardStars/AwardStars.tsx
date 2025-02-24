import imgBlankStar from "../../../public/img/stars/blank-star.png"
import Image from "next/image"
import { type IAward } from "types"
import styles from "./AwardStars.module.css"

interface AwardStarsProps {
  awards: IAward[]
  daysSinceLastCriticalError: number
}

const awardsArrayToMap = (awards: IAward[]): Map<number, IAward> =>  {
  return awards.reduce((map, award) => {
    map.set(award.id, award);
    return map;
  }, new Map(awards.sort((a, b) => a.days_required - b.days_required).map(award => [award.id, award])));
}

const AwardStars = ({ daysSinceLastCriticalError = 0, awards }:AwardStarsProps) => {

  // Convert awards array to Map to ensure the proper order by the days_required property (ascending)
  const awardsMap = awardsArrayToMap(awards)

  return (
    <div className={styles.fadeIn}>
      <div
        className="
          md:mt-11 min-w-[261px] max-w-max
          border-4 border-black border-dashed bg-gradient-to-b from-[#171759] to-[#2A2A90] py-[17px] px-[30px] rounded-xl
          flex items-center gap-x-[29px]
          "
      >

        <Image
          src={ daysSinceLastCriticalError >= awardsMap.get(1)!.days_required ? awardsMap.get(1)!.icon_small! : imgBlankStar }
          width={45}
          height={42}
          alt={awardsMap.get(1)!.name}
        />

        <Image
          src={ daysSinceLastCriticalError >= awardsMap.get(2)!.days_required ? awardsMap.get(2)!.icon_small! : imgBlankStar }
          width={45}
          height={42}
          alt={awardsMap.get(2)!.name}
        />

        <Image
          src={ daysSinceLastCriticalError >= awardsMap.get(3)!.days_required ? awardsMap.get(3)!.icon_small! : imgBlankStar }
          width={45}
          height={42}
          alt={awardsMap.get(3)!.name}
        />
      </div>
    </div>
  )
}

export default AwardStars