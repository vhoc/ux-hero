import { getCurrentPeriod } from "../actions/periods";
import { getIncidents } from "../actions/incidents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function IncidentsPage() {

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  // Current period & criticalErrors
  const currentPeriod = await getCurrentPeriod(todayISO!)
  const incidents = await getIncidents(currentPeriod!)

  return (
    <main className="w-full h-full flex flex-col items-center justify-start bg-gradient-to-b from-[#28287d] to-[#151554] text-white pt-10 px-10">
      <h1 className="text-2xl font-bold">Incidents</h1>
      <h3 className="text-md mt-2">Period: {currentPeriod?.name}</h3>

      {
        incidents && incidents.length >= 1 ?
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
                incidents.map(( incident, index ) => (
                  <TableRow key={`incident-${index}-${incident.id}`}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>{incident.date}</TableCell>
                    <TableCell>{incident.description}</TableCell>
                  </TableRow>
                ))
              }
                
              </TableBody>
            </Table>
          </div>
          :
          <div className="mt-10">
            No incidents have been registered in the current period.
          </div>
      }
    </main>
  );
}