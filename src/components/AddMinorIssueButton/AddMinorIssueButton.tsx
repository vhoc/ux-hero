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
import { addMinorIssue } from "@/app/actions"
import { toast } from "sonner"
import Image from "next/image"
import imgSword from "@/../public/img/hearts/sword.png"

const AddMinorIssueButton = () => {

  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddMinorIssue = () => {
    setLoading(true)
    addMinorIssue(description)
      .then((data) => {
        if (data && 'message' in data) {
          toast.error("Error adding new minor issue", {
            description: <span className="text-red-800">{data.message}</span>,
          })
        }

        if (Array.isArray(data) && data.length >= 1) {
          setDescription("")
          // Check if the new amount of minor issues is equal or greater than [8].
          // If so, add 1 critical error with the description: "Accumulated [8] minor issues"
          

          toast.success("Error menor agregado", {
            description: <span className="text-green-700">Se ha agregado un error menor a la base de datos.</span>,
          })
        }
      })
      .catch((error) => {
        console.error('error saving new minor issue: ', error)
        toast.error("Error adding new minor issue", {
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
          alt="Add minor issue"
          className="w-[45px] h-[45px] ml-4 hover:scale-125 active:scale-75"
        />
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>Motivo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Deseas describir el error que has encontrado?
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
            onClick={handleAddMinorIssue}
          >
            {loading ? <span>Reseteando...</span> : <span>Continuar</span>}
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>

  )
}

export default AddMinorIssueButton