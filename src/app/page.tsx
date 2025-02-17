
import AwardStars from "@/components/AwardStars";
import HUD from "@/components/HUD/HUD";
import MainCounter from "@/components/MainCounter";
import Image from "next/image";
import imgSprites from "../../public/img/sprites-background.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import AchievementCard from "@/components/AchievementCard/AchievementCard";
import { type Award } from "types";

const tempValues = {
  stars: 2,
  days: 14,
  coins: 16,
  awards: [
    {
      order: 1,
      name: "2 movie tickets",
    },
    {
      order: 2,
      name: "Amazon gift card",
    },
    {
      order: 3,
      name: "$1,000 MXN bonus",
    }
  ] as Award[]
}

export default function HomePage() {
  return (
    <main
      className="
        relative w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] 
        text-white px-16
        md:flex-row md:items-start 
      "
    > 
      
      {/* LEFT PANE */}
      <div className="flex flex-col gap-y-16 w-full md:flex-1 h-full z-10">
        <HUD
          player_name="UXNTEAM"
          coins={tempValues.coins}// TEMPORARY
          period={1}
        />

        {/* TWO COLUMNS: AWARDS, BIG COUNTER */}
        <div className="flex flex-col gap-y-10 justify-center items-center w-full h-full xl:flex-row xl:items-start">

          <MainCounter days={tempValues.days} />
          
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="flex flex-col w-full md:flex-1 h-full pt-[73px] z-10 items-center md:items-end">

        <AwardStars stars={tempValues.stars} />

        {/* NOW PLAYING */}
        <div
          className="flex flex-col gap-y-[21px] mt-[34px]"
        >

          <span className="text-white text-[13px] text-right">NOW PLAYING</span>
          <AchievementCard
            daysElapsed={tempValues.days}
            award={tempValues.awards[0]!}
            state="unlocked"
            type="outstanding"
          />

        </div>

        {/* PLAY TO UNLOCK */}
        <div
          className="flex flex-col gap-y-[13px] mt-[35px] items-end"
        >

          <span className="text-white text-[13px] text-right">PLAY TU UNLOCK</span>
          <div className="w-full mr-0">
            <AchievementCard
              daysElapsed={tempValues.days}
              award={tempValues.awards[1]!}
              state="upcoming"
              type="remarkable"
            />
          </div>

          <AchievementCard
            daysElapsed={tempValues.days}
            award={tempValues.awards[2]!}
            state="locked"
            type="spectacular"
          />

        </div>

      </div>

      {/* BACKGROUND SPRITES */}
      <Image
        src={imgSprites as StaticImport}
        alt="Sprites background"
        width={1031}
        height={474}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          // objectFit: "contain",
          // objectPosition: "bottom left",
        }}
        className="z-0"
        priority
      />
      

    </main>
  );
}
