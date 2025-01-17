import Image from 'next/image'

const steps = [
  {
    id: 1,
    title: "Text Screenshots",
    description: [
      "Text screenshots of dating profiles, text or social media conversations",
      "Works with multiple screenshots including combinations of profiles and conversations"
    ],
    image: "/STEP1.png"
  },
  {
    id: 2,
    title: "AI Text Suggestions",
    description: [
      "Our AI will respond with customized suggestions based on the screenshots",
      "Text our AI back if you want changes or try our RIZZ and other special modes"
    ],
    image: "/STEP2.png"
  }
]

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          How It <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent ">Works</span>
        </h2>
        <div className="space-y-16">
          {steps.map((step) => (
            <div key={step.id} className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`${step.id % 2 === 0 ? 'md:order-2' : ''}`}>
                <Image
                  src={step.image || ''}
                  alt={step.title}
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              </div>
              <div>
                <div className="mb-4">
                  <span className="text-[#DC1FFF] font-medium">STEP {step.id}</span>
                  <h3 className="text-2xl font-bold text-white mt-2">{step.title}</h3>
                </div>
                <ul className="space-y-4">
                  {step.description.map((item, index) => (
                    <li key={index} className="flex items-start text-white">
                      <span className="text-[#DC1FFF] mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection