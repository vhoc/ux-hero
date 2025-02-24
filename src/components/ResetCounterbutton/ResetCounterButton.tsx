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

const ResetCounterButton = () => {

  const [description, setDescription] = useState("")

  return (
    <AlertDialog>

      <AlertDialogTrigger
        className="mt-5 bg-yellow-200 hover:bg-yellow-500 active:bg-white bg-no-repeat bg-contain bg-center text-black px-4 py-3"
        style={{
          boxShadow: `6px 6px 0px black`,
        }}
      >
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
          >
            Continuar
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
    
  )
}

export default ResetCounterButton