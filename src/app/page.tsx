
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

  // Get today's date
  // const today = new Date();
  const today = new Date('2025-01-06T18:51:14.775Z');

  const todayISO: string = today.toISOString().split('T')[0]!;

  // Get awards
  const awards = await getAwards()

  // Current period
  const currentPeriod  = await getCurrentPeriod(todayISO)

  // Current month period
  const currentMonthPeriod = await getCurrentMonthPeriod(today)

  // Critical errors
  const criticalErrors = await getCriticalErrors( currentPeriod! )

  // Minor issues
  const minor_issues = await getMinorIssues( currentMonthPeriod ) ?? []


  if (!currentPeriod || !awards || !criticalErrors ) return null

  // DEBUG
  const debugData = {
    today,
    todayISO,
    currentPeriod,
    currentMonthPeriod,
  }

  console.log("DEBUG DATA =", debugData)

  return (
    <main
      className="
        relative w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] 
        text-white
      "
    >
      
      <PageContent
        today={today}
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
        }}
        className="z-0"
        priority
      />
      
      <Toaster />
    </main>
  );
}
