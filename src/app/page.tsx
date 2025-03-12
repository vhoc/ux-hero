
import Image from "next/image";
import imgSprites from "../../public/img/sprites-background.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import PageContent from "@/components/PageContent";
import { getAwards } from "@/app/actions/awards";
import { getIncidents } from "@/app/actions/incidents";
import { checkIfHearsWereRestored } from "@/app/actions/health";
import { getCurrentPeriod, getCurrentMonthPeriod, getAllPeriods } from "@/app/actions/periods";
import { getCriticalErrors } from "@/app/actions/critical_errors";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";

// For the checkIfHearsWereRestored function
export const dynamic = 'force-dynamic';

export default async function HomePage() {

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  // Get today's date
  // const today = new Date();
  const today = new Date('2025-05-01T18:51:14.775Z');
  const currentYear = Number(process.env.CURRENT_YEAR)

  const todayISO: string = today.toISOString().split('T')[0]!;

  // Get awards
  const awards = await getAwards()

  // Current period
  const currentPeriod  = await getCurrentPeriod(todayISO)

  // Get all periods
  const allPeriods = await getAllPeriods(currentYear) ?? []

  // Current month period
  const currentMonthPeriod = await getCurrentMonthPeriod(today)

  // Critical errors
  const criticalErrors = await getCriticalErrors( currentPeriod! )

  // Minor issues
  const incidents = await getIncidents( currentMonthPeriod ) ?? []

  // Hearts restoration check & event
  await checkIfHearsWereRestored(today)




  if (!currentPeriod || !awards || !criticalErrors ) return null

  // DEBUG
  // const debugData = {
  //   today,
  //   todayISO,
  //   currentPeriod,
  //   currentMonthPeriod,
  // }

  // console.log("DEBUG DATA =", debugData)

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
        // currentPeriod={currentPeriod}// DEPRECATED
        currentMonthPeriod={currentMonthPeriod}
        initialCriticalErrors={criticalErrors}
        initialPeriods={allPeriods}
        userData={userData.user}
        initialIncidents={incidents}
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
