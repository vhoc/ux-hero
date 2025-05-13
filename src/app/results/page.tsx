import { getAllPeriods } from "@/app/actions/periods";
import { getAwards } from "@/app/actions/awards";
import { calculateAwardPot } from "@/utils/misc";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function ResultsPage() {

  const currentYear = Number(process.env.CURRENT_YEAR)
  const periods = await getAllPeriods(currentYear) ?? []
  const awards = await getAwards()

  const awardPots = periods.map(period => ({ period_id: period.id, award_amount: calculateAwardPot(awards!, period) }))

  return (
    <main className="w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] text-white pt-10 px-4 md:px-10">
      <h1 className="text-2xl font-bold">Results</h1>

      {
        periods && periods.length >= 1 ?
          <div className="w-full flex justify-center mt-10">
            <Table className="max-w-[1440px] mx-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-yellow-400 text-center text-xs md:text-base">Period</TableHead>
                  <TableHead className="text-yellow-400 text-center text-xs md:text-base">Awards achieved</TableHead>
                  <TableHead className="text-yellow-400 text-center text-xs md:text-base">Total prize earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
                periods.map(( period, index ) => (
                  <TableRow key={`period-${index}-${period.id}`} className="h-full">
                    <TableCell className="text-xs md:text-base text-center">{period.name}</TableCell>

                    <TableCell className="flex gap-1 md:gap-4 items-center justify-center">

                      {
                        period.achieved_1 && awards?.find(award => award.id === period.achieved_1)?.id && awards?.find(award => award.id === period.achieved_1)?.icon ?
                          <Image src={awards?.find(award => award.id === period.achieved_1)?.icon ?? ''} alt="Award" width={48} height={48} className="w-6 h-6 md:w-10 md:h-10" />
                          : null
                      }

                      {
                        period.achieved_2 && awards?.find(award => award.id === period.achieved_2)?.id && awards?.find(award => award.id === period.achieved_2)?.icon ?
                          <Image src={awards?.find(award => award.id === period.achieved_2)?.icon ?? ''} alt="Award" width={48} height={48} className="w-6 h-6 md:w-10 md:h-10" />
                          : null
                      }

                      {
                        period.achieved_3 && awards?.find(award => award.id === period.achieved_3)?.id && awards?.find(award => award.id === period.achieved_3)?.icon ?
                          <Image src={awards?.find(award => award.id === period.achieved_3)?.icon ?? ''} alt="Award" width={48} height={48} className="w-6 h-6 md:w-10 md:h-10" />
                          : null
                      }

                    </TableCell>

                    <TableCell className="text-center text-sm md:text-2xl">
                      {
                        awardPots.find(awardPot => awardPot.period_id === period.id)?.award_amount ?
                          <span>$ {awardPots.find(awardPot => awardPot.period_id === period.id)?.award_amount}</span>
                          : null
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
                
              </TableBody>
            </Table>
          </div>
          :
          <div>
            No critical errors have been registered in the current period.
          </div>
      }
    </main>
  );
}