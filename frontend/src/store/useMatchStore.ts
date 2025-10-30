import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { Socket } from "socket.io-client";

type MatchStore = {
    isLoadingMatches: boolean,
    isLoadingProfile: boolean,
    swipeFeedback: any,
    matches: any[],
    userProfiles: [],
    getMyMatches: () => void,
    getUserProfiles: () => void,
    swipeLeft: (user: any) => void,
    swipeRight: (user: any) => void,
    subscribeToNewMatches: () => void,
    unsubscribeNewMatchs: () => void
}

export const useMatchStore = create<MatchStore>((set) => ({
    isLoadingMatches: false,
    isLoadingProfile: false,
    swipeFeedback: null,
    matches: [],
    userProfiles: [],

    getMyMatches: async () => {
        try {
            set({ isLoadingMatches: true });
            const res = await axiosInstance.get<any>('/matches')
            set({ matches: res.data?.matches })
        } catch (error: any) {
            set({ matches: [] })
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoadingMatches: false });
        }
    },

    getUserProfiles: async () => {
        try {
            set({ isLoadingProfile: true });
            const res = await axiosInstance.get<any>('/matches/user-profiles')
            set({ userProfiles: res.data?.users })
        } catch (error: any) {
            set({ userProfiles: [] })
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoadingProfile: false });
        }
    },

    swipeLeft: async (user: any) => {
        try {
            set({ swipeFeedback: 'passed' });
            await axiosInstance.post('/matches/swipe-left/' + user._id)
        } catch (error) {
            console.log(error);
            toast.error("Failed to swipe left");
        } finally {
            setTimeout(() => set({ swipeFeedback: null }), 100);
        }
    },

    swipeRight: async (user: any) => {
        try {
            set({ swipeFeedback: "liked" });
            await axiosInstance.post('/matches/swipe-right/' + user._id)
        } catch (error) {
            console.log(error)
            toast.error('failed to swipe right')
        } finally {
            setTimeout(() => {
                set({ swipeFeedback: null })
            }, 100);
        }
    },

    subscribeToNewMatches: () => {
        try {
            const socket = getSocket() as Socket;

            socket.on('newMatch', (newMatch: any) => {
                set((data) => ({
                    matches: [...data.matches, newMatch]
                }))
                toast.success('You got a new Match');
            });
        } catch (error) {
            console.log(error);
        }
    },


    unsubscribeNewMatchs: () => {
        try {
            const socket = getSocket() as Socket;
            socket.off('newMatch')
        } catch (error) { 
            console.error(error)
        }
    }
}));