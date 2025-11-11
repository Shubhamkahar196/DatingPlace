import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { Socket } from "socket.io-client";

type MatchStore = {
    isLoadingMatches: boolean,
    isLoadingProfile: boolean,
    isLoadingUsers: boolean,
    isLoadingRequests: boolean,
    isLoadingFriends: boolean,
    swipeFeedback: any,
    matches: any[],
    userProfiles: [],
    users: any[],
    friendRequests: any[],
    friends: any[],
    getMyMatches: () => void,
    getUserProfiles: () => void,
    getAllUsers: () => void,
    getFriendRequests: () => void,
    getFriends: () => void,
    sendFriendRequest: (userId: string) => void,
    acceptFriendRequest: (userId: string) => void,
    swipeLeft: (user: any) => void,
    swipeRight: (user: any) => void,
    subscribeToNewMatches: () => void,
    unsubscribeNewMatchs: () => void,
    subscribeToFriendRequests: () => void,
    unsubscribeFromFriendRequests: () => void
}

export const useMatchStore = create<MatchStore>((set, get) => ({
    isLoadingMatches: false,
    isLoadingProfile: false,
    isLoadingUsers: false,
    isLoadingRequests: false,
    isLoadingFriends: false,
    swipeFeedback: null,
    matches: [],
    userProfiles: [],
    users: [],
    friendRequests: [],
    friends: [],

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

    getAllUsers: async () => {
        try {
            set({ isLoadingUsers: true });
            const res = await axiosInstance.get<any>('/users/all')
            set({ users: res.data?.users })
        } catch (error: any) {
            set({ users: [] })
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getFriendRequests: async () => {
        try {
            set({ isLoadingRequests: true });
            const res = await axiosInstance.get<any>('/users/requests')
            set({ friendRequests: res.data?.requests })
        } catch (error: any) {
            set({ friendRequests: [] })
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoadingRequests: false });
        }
    },

    getFriends: async () => {
        try {
            set({ isLoadingFriends: true });
            const res = await axiosInstance.get<any>('/users/friends')
            set({ friends: res.data?.friends })
        } catch (error: any) {
            set({ friends: [] })
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoadingFriends: false });
        }
    },

    sendFriendRequest: async (userId: string) => {
        try {
            await axiosInstance.post('/users/send-request/' + userId)
            toast.success('Friend request sent')
            // Refresh users list
            get().getAllUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send request')
        }
    },

    acceptFriendRequest: async (userId: string) => {
        try {
            await axiosInstance.post('/users/accept-request/' + userId)
            toast.success('Friend request accepted')
            // Refresh requests, friends, and matches (since accepting creates a match)
            get().getFriendRequests();
            get().getFriends();
            get().getMyMatches();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to accept request')
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

    subscribeToFriendRequests: () => {
        try {
            const socket = getSocket() as Socket;

            socket.on('newFriendRequest', (newRequest: any) => {
                set((data) => ({
                    friendRequests: [...data.friendRequests, newRequest]
                }))
                toast.success('You have a new friend request');
            });

            socket.on('friendRequestAccepted', (newFriend: any) => {
                set((data) => ({
                    friends: [...data.friends, newFriend]
                }))
                toast.success('Friend request accepted');
            });

            // Listen for new matches from friend request acceptance
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
    },

    unsubscribeFromFriendRequests: () => {
        try {
            const socket = getSocket() as Socket;
            socket.off('newFriendRequest')
            socket.off('friendRequestAccepted')
            socket.off('newMatch')
        } catch (error) {
            console.error(error)
        }
    }
}));
