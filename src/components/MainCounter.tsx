import { type User } from "@supabase/supabase-js"
import ResetCounterButton from "./ResetCounterbutton/ResetCounterButton"
import imgWarning from "@/../public/img/ui/warning.svg"
import Image from "next/image"
import { type StaticImport } from "next/dist/shared/lib/get-img-props"

interface MainCounterProps {
  days: number
  userData?: User | null
  today: Date
  periodId: number
  incidents_amount: number
}

const MainCounter = ({ days = 0, userData, today, periodId, incidents_amount = 0 }: MainCounterProps) => {

  return (
    <div className="flex flex-col gap-[13px] justify-center items-center w-full xl:h-full px-4 relative">

      {
        incidents_amount >= 1 ?
          <div className="absolute top-0 left-0 w-full flex items-center gap-4">
            <Image src={imgWarning as StaticImport} alt="Warning" width={20} height={22} />
            <div className="flex gap-2 items-center">
              <span>{incidents_amount}</span>
              <span>INCIDENTS</span>
            </div>
          </div>
          : null
      }

      <span
        className="text-white text-center text-[100px] md:text-[150px] leading-none "
        style={{
          textShadow: "10px 10px 0px #0d0d38",
        }}
      >

        {days}

      </span>

      <div className="flex flex-col">
        <span
          className="text-center text-white text-xl md:text-2xl"
          style={{
            textShadow: "4px 4px 0px #0d0d38",
          }}
        >
          DAYS WITHOUT
        </span>
        <span
          className="text-center text-white text-xl md:text-2xl"
          style={{
            textShadow: "4px 4px 0px #0d0d38",
          }}
        >
          CRITICAL ERRORS
        </span>
      </div>

      {
        userData ?
          <div className="flex flex-col">
            <ResetCounterButton today={today} periodId={periodId} />
          </div>
          :
          null
      }


    </div>
  )

}

export default MainCounter