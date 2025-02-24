
import Image from "next/image";
import imgSprites from "../../public/img/sprites-background.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import PageContent from "@/components/PageContent";
import {
  getCurrentPeriod,
  getCriticalErrors, 
  getAwards,
} from "./actions";



export default async function HomePage() {


  // Get awards
  const awards = await getAwards()

  // Current period
  const currentPeriod  = await getCurrentPeriod()

  // Critical errors
  const criticalErrors = await getCriticalErrors( currentPeriod! )


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
