"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useSession ,signOut} from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const NavBar = () => {
  const session=useSession()
  return (
    <div className='min-h-[5vh] flex justify-between  items-center py-2 sm:px-5'>
        <div className='flex font-bold text-red-500 text-xl'>ACS</div>
        <div className='flex justify-center items-center sm:gap-6 gap-1'>
        <Link
        href="/"
                className=" hover:text-red-500"
                prefetch={true}
              >
               Home
              </Link>
        <Link
        href="/aboutus"
                className=" hover:text-red-500"
                prefetch={true}
              >
                About us
              </Link>
        <Link
        href="/aimodel"
                className=" hover:text-red-500"
                prefetch={true}
              >
                Express Yourself
              </Link>
              {session?.data?.user && session.data.user.image &&  <Avatar onClick={()=>{
                signOut();
              }}>
  <AvatarImage src={session?.data?.user?.image} className='cursor-pointer ' />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
}{!session?.data?.user && <form action={()=>{
        redirect("/auth/login")
      }}>
        <Button type="submit" className="rounded-sm shadow-none" >Try now!</Button></form>}
        </div>
        
    </div>
  )
}

export default NavBar
