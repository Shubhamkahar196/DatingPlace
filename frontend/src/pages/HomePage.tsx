import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { Header } from "../components/Header";
import NoUsersFound from "../components/NoMatchesFound";
import LoadingUI from "../components/LoadingUI";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const {
        isLoadingUsers,
        getAllUsers,
        users,
        subscribeToNewMatches,
        unsubscribeNewMatchs,
        subscribeToFriendRequests,
        unsubscribeFromFriendRequests
    } = useMatchStore();

    const {authUser} = useAuthStore();

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        if (authUser) {
            subscribeToNewMatches();
            subscribeToFriendRequests();
        }

        return () => {
            unsubscribeNewMatchs();
            unsubscribeFromFriendRequests();
        };
    }, [subscribeToNewMatches, unsubscribeNewMatchs, subscribeToFriendRequests, unsubscribeFromFriendRequests, authUser]);

    console.log('users are : ', users);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-linear-to-br from-pink-100 to-purple-100 overflow-hidden">
            <Sidebar />
            <div className="grow flex flex-col overflow-hidden">
                <Header />
                <main className="grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden">
                    {users.length > 0 && !isLoadingUsers && (
                        <UserList />
                    )}

                    {users.length === 0 && !isLoadingUsers && (
                        <NoUsersFound />
                    )}

                    {isLoadingUsers && <LoadingUI />}
                </main>
            </div>
        </div>
    )
}

const UserList = () => {
    const { users, sendFriendRequest, acceptFriendRequest, friendRequests } = useMatchStore();
    const navigate = useNavigate();

    const isFriendRequestReceived = (userId: string) => {
        return friendRequests.some((req: any) => req._id === userId);
    };

    return (
        <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Find Friends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((user: any) => (
                    <div key={user._id} className="bg-white rounded-lg shadow-md p-4">
                        <img
                            src={user.image || "/avatar.png"}
                            alt={user.name}
                            className="w-16 h-16 rounded-full mx-auto mb-2"
                        />
                        <h3 className="text-lg font-semibold text-center">{user.name}</h3>
                        <p className="text-sm text-gray-600 text-center">{user.age} years old</p>
                        <p className="text-sm text-gray-500 text-center mb-4">{user.bio || "No bio"}</p>

                        {isFriendRequestReceived(user._id) ? (
                            <button
                                onClick={async () => {
                                    try {
                                        await acceptFriendRequest(user._id);
                                        navigate(`/chat/${user._id}`);
                                    } catch (error) {
                                        console.error('Failed to accept request:', error);
                                    }
                                }}
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            >
                                Accept Request
                            </button>
                        ) : (
                            <button
                                onClick={() => sendFriendRequest(user._id)}
                                className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
                            >
                                Send Request
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
