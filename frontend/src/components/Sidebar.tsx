import { useEffect, useState } from "react";
import { MessageCircle, X, UserPlus, Check } from 'lucide-react';
import LoadingState from "./LoadingState";
import NoMatchesFound from "./NoMatchesFound";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";
import toast from "react-hot-toast";

interface Match {
    _id: string;
    image?: string;
    name: string;
}

const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const {getMyMatches, matches, isLoadingMatches, getFriendRequests, friendRequests, isLoadingRequests, acceptFriendRequest} = useMatchStore()

    useEffect(() => {
        getMyMatches();
        getFriendRequests();
    }, [getMyMatches, getFriendRequests]);

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
                        {/* Friend Requests Section */}
                        {isLoadingRequests ? (
                            <LoadingState />
                        ) : friendRequests.length > 0 ? (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-pink-600 mb-3 flex items-center">
                                    <UserPlus size={20} className="mr-2" />
                                    Friend Requests
                                </h3>
                                {friendRequests.map((request: Match) => (
                                    <div key={request._id} className='flex items-center justify-between mb-4 p-2 rounded-lg bg-blue-50 border border-blue-200'>
                                        <div className='flex items-center'>
                                            <img
                                                src={request.image || "/placeholder.png"}
                                                alt='User placeholder'
                                                className='size-12 object-cover rounded-full mr-3 border-2 border-blue-300'
                                            />
                                            <h3 className='font-semibold text-gray-800'>{request.name}</h3>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await acceptFriendRequest(request._id);
                                                    toast.success('Friend request accepted!');
                                                } catch {
                                                    toast.error('Failed to accept request');
                                                }
                                            }}
                                            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                                            title="Accept Request"
                                        >
                                            <Check size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {/* Matches Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-pink-600 mb-3 flex items-center">
                                <MessageCircle size={20} className="mr-2" />
                                Matches
                            </h3>
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