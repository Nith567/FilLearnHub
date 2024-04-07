import Image from 'next/image'
export default function Home() {
  return (
<div>
<section className="bg-white text-black py-16">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Create Courses or upload datasets and take your 100% revenue, zero fees
                </h1>
                <p className="text-lg md:text-xl mb-8">
                    Welcome to <span className="font-bold">FLB</span>, where we are changing the game in the providing varies courses.
                    Learn anything with our comprehensive
                </p>
                <div className="flex justify-center">
                    {/* <Image
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.mckinsey.com%2F~%2Fmedia%2FMcKinsey%2FBusiness%2520Functions%2FMcKinsey%2520Digital%2FOur%2520Insights%2FCreating%2520a%2520successful%2520Internet%2520of%2520Things%2520data%2520marketplace%2FInsights-Creating-a-successful-Internet-of-Things-1536x1536-300_Standard.ashx&f=1&nofb=1&ipt=1f70da9e06f4bb52bc886fe4684a47a3bed3f1e9dd21214cb466e783f2745302&ipo=images"
                        alt="Among Nature "
                        width={500}
                        height={500}
                        className="max-w-full h-auto"
                    /> */}
                </div>
            </div>
        </section>
</div>
  )
}