import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Link href="/" className="inline-block mb-8">
            <span className="text-sm xl:text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent text-2xl font-bold">rizzmaster</span>
              <span className="text-white">69</span>
            </span>
            </Link>
           
          
           
            <div className="flex flex-row items-center justify-center gap-6">
  <Link href="#" target="_blank">
  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">
    <Image
      src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg"
      alt="GitHub"
      width={24}
      height={24}
      className="text-[#00FFA3]"
      />
      </div>
  </Link>
  <Link href="#" target="_blank">
  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">

    <Image
      src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/gitbook.svg"
      alt="GitBook"
      width={24}
      height={24}
      className="text-[#00FFA3]"
      />
      </div>
  </Link>
  <Link href="#" target="_blank">
  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">

    <Image
      src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg"
      alt="Twitter"
      width={24}
      height={24}
      className="text-[#00FFA3]"
      />
      </div>
  </Link>
  <Link href="#" target="_blank">
  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] flex items-center justify-center">

    <Image
      src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/telegram.svg"
      alt="Telegram"
      width={24}
      height={24}
      className="text-[#00FFA3]"
      />
      </div>
  </Link>
</div>

<p className="text-center text-sm text-gray-500 mt-4">
  © {new Date().getFullYear()} $master. All rights reserved.
</p>


          </div>                  
        </div>
      </div>
    </footer>
  )
}

export default Footer