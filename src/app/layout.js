import './globals.css'
import { WalletProvider } from './context/walletcontext'
import Head from 'next/head'



export default function RootLayout({ children }) {

  return (
    <>
    <html lang="en">
    <head />
  <body>
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

            <WalletProvider>
               {children}   
               </WalletProvider>   
      
      </body>
    </html>
    </>
  )
}
