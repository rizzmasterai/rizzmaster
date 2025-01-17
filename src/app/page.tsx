import Head from 'next/head'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import HowItWorksSection from '../components/HowItWorksSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
          <main>
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <Footer />
      </main>
    </div>
  )
}

export default Home