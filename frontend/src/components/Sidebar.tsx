import { useEffect, useState } from "react";
import { MessageCircle, X } from 'lucide-react';
import LoadingState from "./LoadingState";
import NoMatchesFound from "./NoMatchesFound";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

interface Match {
    _id: string;
    image?: string;
    name: string;
}

const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const {getMyMatches, matches,isLoadingMatches} = useMatchStore()

    useEffect(() => {
        getMyMatches();
    }, [getMyMatches]);

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300 ease-in-out
            ${isOpen ? 'transition-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static l:w-1/4
            `}

            >
                <div className="flex flex-col h-full">
                    <div className='p-4 pb-[27px] border-b border-pink-200 flex justify-between items-center'>
                        <h2 className='text-xl font-bold text-pink-600'>Matches</h2>
                        <button
                            className='lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                            onClick={toggleSidebar}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grow overflow-y-auto p-4 z-10 relative">
                        {isLoadingMatches ? <LoadingState /> : matches.length === 0 ? <NoMatchesFound /> : (matches.map((match: Match) => (
                            <Link key={match._id} to={`/chat/${match._id}`}>
                                <div className='flex items-center mb-4 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors duration-300'>
                                    <img
                                        src={match.image || "/placeholder.png"}
                                        alt='User placeholder'
                                        className='size-12 object-cover rounded-full mr-3 border-2 border-pink-300'
                                    />

                                    <h3 className='font-semibold text-gray-800'>{match.name}</h3>
                                </div>
                            </Link>
                        )))}
                    </div>

                </div>
            </div>

            <button
                className='lg:hidden fixed top-4 left-4 p-2 bg-pink-500 text-white rounded-md z-0'
                onClick={toggleSidebar}
            >
                <MessageCircle size={24} />
            </button>
        </>
    )
}

export default Sidebar;