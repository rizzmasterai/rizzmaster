'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WalletButton } from '@/components/dynamic-components'
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#212121]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-sm xl:text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent text-2xl font-bold">rizzmaster</span>
              <span className="text-white">69</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
          <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar