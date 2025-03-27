"use client"

import Link from "next/link";
import { pixelifySans } from "@/fonts";
import { usePathname } from "next/navigation";


interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {

  const pathname = usePathname()

  return (
    <Link href={href} className={`${pixelifySans.className} text-sm md:text-base ${ href === pathname ? 'text-yellow-400' : '' }`}>
      {children}
    </Link>
  )

}

export default NavLink