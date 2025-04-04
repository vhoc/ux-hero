import { getCurrentPeriod } from "../actions/periods";
import { getCriticalErrors } from "../actions/critical_errors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function CriticalErrorsPage() {

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // Current period & criticalErrors
  const currentPeriod = await getCurrentPeriod(todayISO!)
  const criticalErrors = await getCriticalErrors(currentPeriod!)

  return (
    <main className="w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] text-white pt-10 px-10">
      <h1 className="text-2xl font-bold">Critical Errors</h1>
      <h3 className="text-md mt-2">Period: {currentPeriod?.name}</h3>

      {
        criticalErrors && criticalErrors.length >= 1 ?
          <div className="w-full flex justify-center mt-10">
            <Table className="max-w-[1440px] mx-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-yellow-400">ID</TableHead>
                  <TableHead className="text-yellow-400 w-[200px]">Date recorded</TableHead>
                  <TableHead className="text-yellow-400 ">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
                criticalErrors.map(( error, index ) => (
                  <TableRow key={`critical-error-${index}-${error.id}`}>
                    <TableCell className="font-medium">{error.id}</TableCell>
                    <TableCell>{error.date}</TableCell>
                    <TableCell>{error.description}</TableCell>
                  </TableRow>
                ))
              }
                
              </TableBody>
            </Table>
          </div>
          :
          <div className="mt-10">
            No critical errors have been registered in the current period.
          </div>
      }
    </main>
  );
}