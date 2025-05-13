import { type User } from "@supabase/supabase-js"
import ResetCounterButton from "./ResetCounterbutton/ResetCounterButton"


interface MainCounterProps {
  days: number
  userData?: User | null
  today: Date
  periodId: number
}

const MainCounter = ({ days = 0, userData, today, periodId }: MainCounterProps) => {

  return (
    <div className="flex flex-col gap-[13px] justify-center items-center w-full xl:h-full px-4 relative">

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