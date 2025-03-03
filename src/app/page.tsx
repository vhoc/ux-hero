
import Image from "next/image";
import imgSprites from "../../public/img/sprites-background.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import PageContent from "@/components/PageContent";
import {
  getCurrentPeriod,
  getCurrentMonthPeriod,
  getCriticalErrors, 
  getAwards,
  getMinorIssues,
} from "./actions";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";


export default async function HomePage() {

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  // Get awards
  const awards = await getAwards()

  // Current period
  const currentPeriod  = await getCurrentPeriod()

  // Current month period
  const currentMonthPeriod = await getCurrentMonthPeriod()

  // Critical errors
  const criticalErrors = await getCriticalErrors( currentPeriod! )

  // Minor issues
  const minor_issues = await getMinorIssues( currentMonthPeriod ) ?? []


  if (!currentPeriod || !awards || !criticalErrors ) return null 

  return (
    <main
      className="
        relative w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] 
        text-white
      "
    >
      
      <PageContent
        awards={awards}
        currentPeriod={currentPeriod}
        currentMonthPeriod={currentMonthPeriod}
        initialCriticalErrors={criticalErrors}
        userData={userData.user}
        initialMinorIssues={minor_issues}
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
      
      <Toaster />
    </main>
  );
}
