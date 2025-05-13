"use client"
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { signOut } from "@/app/actions/auth";
import { type User } from "@supabase/supabase-js";
import NavLink from "./NavLink";
import { pixelifySans } from "@/fonts";

interface NavSheetProps {
  user?: User | null
}

const NavSheet = ({ user }: NavSheetProps) => {

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetTrigger>
        <Menu />
      </SheetTrigger>

      <SheetContent className="bg-black text-white">
        <SheetHeader>
          <SheetTitle className="text-white mb-8">Menu</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <div onClick={() => setOpen(false)}>
          <NavLink href={'/'} >
            Home
          </NavLink>
          </div>

          <div onClick={() => setOpen(false)}>
          <NavLink href={'/results'} >
            Results
          </NavLink>
          </div>

          <div onClick={() => setOpen(false)}>
            <NavLink href={'/critical-errors'} >
              Critical errors
            </NavLink>
          </div>

          <div onClick={() => setOpen(false)}>
          <NavLink href={'/incidents'} >
            Incidents
          </NavLink>
          </div>
          {
            user ?
              <button onClick={signOut} className={`${pixelifySans.className} text-sm md:text-base`}>
                Log out
              </button>

              :
              <div onClick={() => setOpen(false)}>
              <NavLink href="/login" >
                Admin Log-in
              </NavLink>
              </div>
          }
        </div>
      </SheetContent>

    </Sheet>
  )
}

export default NavSheet