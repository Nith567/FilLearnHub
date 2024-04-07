import './globals.css'
import Head from 'next/head'
import Navbar from '@/components/navbar'
import Providerss from './provider'

export default function RootLayout({ children }) {

  return (
    <html lang="en">
    <head />

  <body>
  <Providerss>
    <div>
    <Head>
        <title>LEARN HUB FILECOIN</title>
        <meta name="description" content="fil" key="desc" />
        <meta property="og:title" content="Filehub through our decentralised storage" />
        <meta
          property="og:description"
          content="Decentralised filecoin storage"
        />
      </Head>
    </div>
 
              <Navbar/>
               {children}   

               </Providerss>
      </body>
    </html>

  )
}
