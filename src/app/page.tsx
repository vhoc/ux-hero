
import AwardStars from "@/components/AwardStars";
import HUD from "@/components/HUD/HUD";
import MainCounter from "@/components/MainCounter";
import Image from "next/image";
import imgSprites from "../../public/img/sprites-background.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import AchievementsDisplay from "@/components/AchievementsDisplay";
import PageContent from "@/components/PageContent";
import {
  getCurrentPeriod,
  getCriticalErrors, 
  getElapsedDaysSinceLastCriticalError,
  getAwards,
} from "./actions";

// export const revalidate = 0


export default async function HomePage() {

  // const today = new Date();
  // const todayISO = today.toISOString().split('T')[0]!;

  // Get awards
  const awards = await getAwards()

  // Current period
  const currentPeriod  = await getCurrentPeriod()

  // Critical errors
  const criticalErrors = await getCriticalErrors( currentPeriod! )

  // Days elapsed in the current period since the last critical error
  // const daysSinceLastCriticalError = await getElapsedDaysSinceLastCriticalError(criticalErrors ?? [], currentPeriod?.start_date ?? '', todayISO)

  if (!currentPeriod || !awards || !criticalErrors ) return null 

  return (
    <main
      className="
        relative w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] 
        text-white px-16
        md:flex-row md:items-start 
      "
    > 
      
      <PageContent
        awards={awards}
        currentPeriod={currentPeriod}
        initialCriticalErrors={criticalErrors}
      />

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
