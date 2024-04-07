"use client"
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { PiHandCoinsDuotone } from 'react-icons/pi'
import { HiOutlineBuildingLibrary } from 'react-icons/hi2'
import { SiSololearn } from "react-icons/si";
import { GiTeacher } from "react-icons/gi";
import {usePrivy} from '@privy-io/react-auth';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletConnected, setWalletConnected] = useState(false);
    const {ready, authenticated, login,user} = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    const handleWalletConnect = (status) => {
        setWalletConnected(status);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="" style={{
            backgroundImage: 'linear-gradient(310deg, rgba(240, 100, 20, 0.5) 0%, rgba(314, 100, 27, 0.2) 6%, rgba(336, 100, 42, 0.2) 10%, rgba(13, 100, 60, 0.2) 13%, rgba(42, 100, 50, 0.2) 15%, rgba(53, 100, 59, 0.2) 18%, rgba(45, 100, 71, 0.2) 21%, rgba(35, 100, 81, 0.2) 25%, rgba(21, 100, 90, 0.2) 29%, rgba(4, 94, 95, 0.2) 35%, rgba(0, 16, 87, 0.2) 42%, rgba(0, 17, 77, 0.2) 51%, rgba(0, 17, 67, 0.2) 62%, rgba(0, 17, 57, 0.2) 78%, rgba(0, 18, 47, 0.4) 100%)'
        }}>
        
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4 text-white text-3xl font-bold">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <SiSololearn  className="h-16 w-16 text-white" />
                            <span>FilHub</span>
                        </div>
                    </Link>
                </div>
                <div className="md:hidden">
                    <button
                        className="text-white"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <ul className="hidden md:flex space-x-4 text-white items-center text-lg">
                    <li>
                        <Link href="/" className="flex flex-col items-center">
                            <AiOutlineHome className="text-2xl" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/lists" className="flex flex-col items-center">
                            <PiHandCoinsDuotone className='text-2xl' />
                            <span>Data Market</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/create" className="flex flex-col items-center">
                            <GiTeacher className='text-3xl' />
                            <span>Upload on FHB</span>
                        </Link>
                    </li>
                    <li>
                    {user?.wallet?.address}
                    </li>

                </ul>
            </div>
            {isOpen && (
                <div className="mt-2 space-y-2 text-white text-lg flex m-auto flex-col w-full" onClick={toggleMenu}>
                    <Link href="/" className="flex items-center">
                        <AiOutlineHome className="mr-2" /> Home
                    </Link>
                    <Link href="/lists" className="flex items-center">
                        <PiHandCoinsDuotone className='text-2xl mr-2' /> Data Market
                    </Link>
                    <Link href="/create" className="flex items-center">
                        <HiOutlineBuildingLibrary className='text-2xl mr-2' /> Upload on FHB
                    </Link>
                    {ready && !authenticated && (
      <button disabled={disableLogin} onClick={login}>
        Log in
      </button>
    )}
                   <div className='text-2xl '>
                   {user?.wallet?.address}
                   </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
