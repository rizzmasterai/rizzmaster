// components/HeroSection.tsx
'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { WalletButton } from '@/components/dynamic-components'
const videos = [
  {
    id: 1,
    poster: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e3c516f241a23b28e7875_text_message-poster-00001.jpg",
    videoUrl: "1.mp4",
    webmUrl: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e3c516f241a23b28e7875_text_message-transcode.webm"
  },
  {
    id: 2,
    poster: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e66c54ee739fda969b185_hinge_profile-poster-00001.jpg",
    videoUrl: "2.mp4",
    webmUrl: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e66c54ee739fda969b185_hinge_profile-transcode.webm"
  },
  {
    id: 3,
    poster: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e6794cb7cfc8a5ae0051b_hinge_convo-poster-00001.jpg",
    videoUrl: "3.mp4",
    webmUrl: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e6794cb7cfc8a5ae0051b_hinge_convo-transcode.webm"
  },
  {
    id: 4,
    poster: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e682bd85c88c8dbc22fc7_text_advice-poster-00001.jpg",
    videoUrl: "4.mp4",
    webmUrl: "https://cdn.prod.website-files.com/6706e4607b856db89ebe457b/677e682bd85c88c8dbc22fc7_text_advice-transcode.webm"
  }
]

const HeroSection = () => {
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "0",
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: false,
        arrows: true,
        waitForAnimate: true,
       
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              arrows: false,
              dots: true,
              autoplaySpeed: 4000,
              centerPadding: "0",
            }
          }
        ],
        beforeChange: (current: number, next: number) => {
          const videos = document.querySelectorAll('video');
          videos.forEach(video => {
            video.pause();
          });
        },
        afterChange: (current: number) => {
          const centerVideo = document.querySelector('.slick-current video');
          if (centerVideo instanceof HTMLVideoElement) {
            centerVideo.play();
          }
        }
    };
    

  return (
    <section className="section-hero pt-32 pb-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent ">Level up</span> your rizz game
          </h1>
          <p className="text-xl mb-8">
            Our AI wingman tells you what to say on dating apps, text and socials.
            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent "> It's trained by top dating coaches!</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4">
           
            <div className="flex space-x-4">
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


              
            </div>
          </div>
          <div className='p-4'>
            <WalletButton />

          </div>
        </div>
        <div className="mt-16 relative">
          <Slider {...settings}>
            {videos.map((video) => (
              <div key={video.id} className="hero_slide-item">
                <video
          className="rounded-3xl"
          poster={video.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  <source src={video.webmUrl} type="video/webm" />
                </video>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default HeroSection