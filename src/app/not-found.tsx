import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='min-h-[95vh] flex justify-center flex-col font-bold text-2xl items-center text-red-500'>
      404 Page Not Exits
      <Link href="/"
                className=" hover:text-red-500 underline"
                prefetch={true}>Move To Home</Link>
    </div>
  )
}

export default NotFound
