import { SignedIn, SignInButton, UserButton, SignedOut, SignUpButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkuser } from '@/lib/checkuser'
import { currentUser } from '@clerk/nextjs/server'

const Header = async () => {
  await checkuser(); 
  return (
    <div className='fixed top-0 w-full bg-white/50 backdrop-blur-md z-50 border-b'>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between"> 
         {/* logo to homepage*/}
          <Link href="/">
              <Image src={"/logo.png"} 
              alt="logo"
              height={100}
              width={200}   //{resolution}
              className='h-24 w-auto object-contain' /> {/* dimension*/}
          </Link>
          <div className='flex items-center space-x-4'>
            <SignedIn>
              <Link href={"/dashboard"}
                className='text-gray-800 flex items-center gap-2' >
                <Button variant={"outline"}
                className="h-10 px-6">
                <LayoutDashboard />
                <span className="hidden md:inline text-base">Dashboard</span>
                </Button>
              </Link>
             
              <Link href={"/transaction/create"}
                className=' flex items-center gap-2' >
                <Button >
                  <PenBox/>
                  <span className='hidden md:inline'>Add Transaction</span>
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
                <SignInButton forceRedirectUrl='/dashboard'>
                  <Button variant="outline">LOGIN</Button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton  appearance={  {elements: { avatarBox: "!w-10 !h-10"} }  }/>
            </SignedIn>
          </div>
        </nav>
    </div>
  )
}

export default Header