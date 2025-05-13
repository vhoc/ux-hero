import { login } from "./actions"

export default function LoginPage() {
  return (
    <main
      className="
        relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#28287d] to-[#151554] 
        text-white px-4 sm:px-8 md:px-16
      "
    >

      <form className="flex flex-col gap-4 w-full max-w-md min-w-0">

        <fieldset className="flex flex-col gap-2 w-full justify-between items-start sm:items-center">
          <label htmlFor="email" className="flex-1">Email:</label>
          <input id="email" name="email" type="email" required className="w-full text-black py-3 p-4" />
        </fieldset>
        
        <fieldset className="flex flex-col gap-2 w-full justify-between items-start sm:items-center">
          <label htmlFor="password" className="flex-1">Password:</label>
          <input id="password" name="password" type="password" required className="w-full text-black py-3 p-4" />
        </fieldset>

        <fieldset className="flex flex-col gap-2 w-full justify-between items-start sm:items-center">
          <button
            formAction={login}
            className="bg-white text-black py-3 px-4 w-full mt-4 hover:bg-yellow-300 shadow-[10px_10px_0px_rgba(0,0,0,1)] active:translate-x-[10px] active:translate-y-[10px] active:shadow-none"
          >
            Log in
          </button>
        </fieldset>
      </form>

    </main>

  )
}