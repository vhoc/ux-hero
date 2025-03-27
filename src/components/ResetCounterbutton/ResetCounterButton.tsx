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
import { addCriticalError, resetDaysWithoutCriticals } from "@/app/actions/critical_errors"
import { toast } from "sonner"
import Image from "next/image"
import imgSkull from "@/../public/img/skull.png"
import { restoreHealth } from "@/app/actions/health"

interface ResetCounterButtonProps {
  today: Date
  periodId: number
}

const ResetCounterButton = ({today, periodId}:ResetCounterButtonProps) => {

  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetCounter = () => {
    setLoading(true)

    void resetDaysWithoutCriticals(periodId)
      .then((error) => {
        if (error) {
          console.error(error)
        }
      })
    
    addCriticalError(description, today)
      .then((data) => {
        if (data && 'message' in data) {
          toast.error("Error adding new critical error", {
            description: <span className="text-red-800">{data.message}</span>,
          })
        }

        if (Array.isArray(data) && data.length >= 1) {
          setDescription("")
          // Restore health
          void restoreHealth(today)
          toast.success("Contador reseteado", {
            description: <span className="text-green-700">Se ha añadido el error crítico y se ha reseteado el contador a cero.</span>,
          })
        }
      })
      .catch((error) => {
        console.error('error saving new critical error: ', error)
        toast.error("Error adding new critical error", {
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
        className="mt-5 flex gap-4 items-center hover:bg-white/20 active:bg-white/50 p-4 "
      >
        <Image
          src={imgSkull}
          alt="Skull"
          width={40}
          height={40}
          className="w-[40px] h-[40px]"
        />
        Reset counter
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>Motivo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Deseas describir un motivo por el cual quieres reiniciar el contador?
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
            onClick={handleResetCounter}
          >
            {loading ? <span>Reseteando...</span> : <span>Continuar</span>}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>

  )
}

export default ResetCounterButton