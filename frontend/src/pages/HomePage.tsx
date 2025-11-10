import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import { Header } from "../components/Header";
import NoMoreProfiles from "../components/NoMoreProfile";
import LoadingUI from "../components/LoadingUI";
import SwipeArea from "../components/SwipeArea";
import SwipeFeedback from "../components/SwipeFeedback";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {

    const {isLoadingProfile, getUserProfiles, userProfiles, subscribeToNewMatches, unsubscribeNewMatchs} = useMatchStore();

    const {authUser} = useAuthStore();

    useEffect(() => {
        getUserProfiles();
    }, [getUserProfiles]);

    useEffect(() => {
        if (authUser) {
            subscribeToNewMatches();
        }

        return () => {
            unsubscribeNewMatchs();
        };
    }, [subscribeToNewMatches, unsubscribeNewMatchs, authUser]);

    console.log('users profile is : ', userProfiles);
    

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-linear-to-br from-pink-100 to-purpe-100 overflow-hidden">
            <Sidebar />
            <div className="grow flex flex-col overflow-hidden">
                <Header />
                <main className="grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden">
                    {userProfiles.length > 0 && !isLoadingProfile && (
                        <>
                            <SwipeArea />
                            <SwipeFeedback />
                        </>
                    )}

                    {userProfiles.length === 0 && !isLoadingProfile && (
                        <NoMoreProfiles />
                    )}

                    {isLoadingProfile && <LoadingUI />}
                </main>
            </div>
        </div>
    )
}

export default HomePage;