import Image from "next/image";
import imgLogo1 from "../../public/img/logo1.svg";
import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import { pixelifySans } from "@/fonts";

const Nav = () => {
  return (
    <div
      className="flex justify-between items-center h-[67px] gap-10 bg-gradient-to-b from-[#12124B] to-[#0C0C31] text-white px-16 py-[14px]"
    >
      <Image
        src={imgLogo1 as StaticImport}
        alt="logo"
        width={97}
        height={38}
      />

      <span className={`${pixelifySans.className} text-3xl`}>uxneighbor</span>
    </div>
  )
}

export default Nav