import Image from "next/image";
import imgLogo1 from "../../public/img/logo1.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { pixelifySans } from "@/fonts";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import NavLink from "./ui/NavLink";
import { signOut } from "@/app/actions/auth";

const Nav = async () => {

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  return (
    <div
      className="flex justify-between items-center h-[67px] gap-10 bg-gradient-to-b from-[#12124B] to-[#0C0C31] text-white px-4 md:px-16 py-[14px]"
    >
      <div className="flex gap-4 items-center">
        <Link href={"/"}>
          <Image
            src={imgLogo1 as StaticImport}
            alt="Home"
            width={97}
            height={38}
            className="w-[60px] h-[auto]  md:w-[97px] md:h-[38px]"
          />
        </Link>

        {
          userData?.user ?
            <div className="flex gap-4 items-center">
              <NavLink href={'/critical-errors'} >
                Critical errors
              </NavLink>
              <NavLink href={'/incidents'} >
                Incidents
              </NavLink>
              <button onClick={signOut} className={`${pixelifySans.className} text-sm md:text-base`}>
                Log out
              </button>
            </div>
          :
            <NavLink href="/login" >
              Admin Log-in
            </NavLink>
        }

      </div>
      

      <span className={`${pixelifySans.className} text-base md:text-3xl`}>uxneighbor</span>
    </div>
  )
}

export default Nav