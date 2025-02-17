import imgBlankStar from "../../public/img/stars/blank-star.png"
import imgTealStar from "../../public/img/stars/teal-star.png"
import imgPurpleStar from "../../public/img/stars/purple-star.png"
import imgYellowStar from "../../public/img/stars/yellow-star.svg"
import Image from "next/image"
import { type StaticImport } from "next/dist/shared/lib/get-img-props"

interface AwardStarsProps {
  stars: number
}

const AwardStars = ({ stars = 0 }:AwardStarsProps) => {
  return (
    <div
      className="
        md:mt-11 min-w-[261px] max-w-max
        border-4 border-black border-dashed bg-gradient-to-b from-[#171759] to-[#2A2A90] py-[17px] px-[30px] rounded-xl
        flex items-center gap-x-[29px]
        "
    >

      <Image
        src={ stars >= 1 ? imgTealStar : imgBlankStar }
        width={45}
        height={42}
        alt="First award"
      />

      <Image
        src={ stars >= 2 ? imgPurpleStar : imgBlankStar }
        width={45}
        height={42}
        alt="Second award"
      />

      <Image
        src={stars >= 3 ? imgYellowStar as StaticImport : imgBlankStar as StaticImport}
        width={45}
        height={42}
        alt="Third award"
      />
    </div>
  )
}

export default AwardStars