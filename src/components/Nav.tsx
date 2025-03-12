import Image from "next/image";
import imgLogo1 from "../../public/img/logo1.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { pixelifySans } from "@/fonts";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const Nav = async () => {

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  return (
    <div
      className="flex justify-between items-center h-[67px] gap-10 bg-gradient-to-b from-[#12124B] to-[#0C0C31] text-white px-4 md:px-16 py-[14px]"
    >
      <div className="flex gap-4 items-center">
        <Image
          src={imgLogo1 as StaticImport}
          alt="logo"
          width={97}
          height={38}
          className="w-[60px] h-[auto]  md:w-[97px] md:h-[38px]"
        />

        {
          userData?.user ?
            <button onClick={signOut} className={`${pixelifySans.className} text-sm md:text-base`}>
              Log out
            </button>
          :
            <Link href="/login" className={`${pixelifySans.className} text-sm md:text-base`}>
              Admin Log-in
            </Link>
        }

      </div>
      

      <span className={`${pixelifySans.className} text-base md:text-3xl`}>uxneighbor</span>
    </div>
  )
}

export default Nav