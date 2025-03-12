"use client"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useState } from "react"
import { addIncident, getIncidents } from "@/app/actions/incidents"
import { toast } from "sonner"
import Image from "next/image"
import imgSword from "@/../public/img/hearts/sword.png"
import { type ISingleMonthPeriod } from "types"

interface AddIncidentButtonProps {
  today: Date
  period: ISingleMonthPeriod
}

const AddIncidentButton = ({ today, period }: AddIncidentButtonProps) => {

  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddIncident = () => {
    setLoading(true)
    addIncident(today, description)
      .then((data) => {
        if (data && 'message' in data) {
          toast.error("Error adding new incident", {
            description: <span className="text-red-800">{data.message}</span>,
          })
        }

        if (Array.isArray(data) && data.length >= 1) {
          setDescription("")
          // Check if the new amount of addIncident is equal or greater than [MAX_INCIDENTS].
          // If so, add 1 critical error with the description: "Accumulated [MAX_INCIDENTS] addIncident"
          getIncidents(period)
            .catch(error => { console.error('error fetching incidents: ', error) })

          toast.success("Incidente agregado", {
            description: <span className="text-green-700">Se ha agregado un incidente a la base de datos.</span>,
          })
        }
      })
      .catch((error) => {
        console.error('error saving new incident: ', error)
        toast.error("Error adding new incident", {
          description: <span className="text-red-800">{error}</span>,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AlertDialog>

      <AlertDialogTrigger
      >
        <Image
          src={imgSword}
          width={45}
          height={45}
          alt="Add incident"
          className="w-[45px] h-[45px] ml-4 hover:scale-125 active:scale-75"
        />
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>Motivo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Deseas describir el incidente que has encontrado?
            <Textarea className="mt-4 rounded-none" placeholder="Type your message here." value={description} onChange={(e) => setDescription(e.target.value)} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel
            className="rounded-none"
            onClick={() => setDescription("")}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className="rounded-none"
            disabled={loading}
            onClick={handleAddIncident}
          >
            {loading ? <span>Reseteando...</span> : <span>Continuar</span>}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>

  )
}

export default AddIncidentButton