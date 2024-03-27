import Image from 'next/image'
export default function Home() {
  return (
<div>
<section className="bg-white text-black py-16">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Create Courses and learn 
                </h1>
                <p className="text-lg md:text-xl mb-8">
                    Welcome to <span className="font-bold">FLB</span>, where we are changing the game in the providing varies courses.
                    Learn anything with our comprehensive
                </p>
                <p className="text-lg md:text-xl mb-8">
                   We make leanring interactive with other same course fellow mates innvoative with happy teaching, releasing dyanmic nfts tableland
                </p>
                <div className="flex justify-center">
                    {/* <Image
                        src="/undraw_among_nature_p1xb.png"
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