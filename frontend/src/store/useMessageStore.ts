import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

type messageStore = {
    messages: any[],
    loading: boolean,
    sendMessage: (receiverId: string, content: string) => void,
    getMessage: (userId: string) => void,
    subscribeMessages: () => void,
    unsubscribeFromMessages: () => void
}

type Resdata = {
    messages: any
}

export const useMessageStore = create<messageStore>((set) => ({
    messages: [],
    loading: true,

    sendMessage: async (receiverId : string, content: string) => {
        try {
            set(prev => ({
                messages: [...prev.messages, { sender: useAuthStore.getState().authUser._id, content}]
            }))
            const res = await axiosInstance.post('/messages/send', {receiverId, content})
            console.log(res.data);
            
        } catch (error) {
            console.log(error);
        } finally {
            set({loading : false})
        }
    },

    getMessage: async (userId) => {
        try {
            set({loading: true});
            const res = await axiosInstance.get<Resdata>(`/messages/conversation/${userId}`)
            set({messages: res.data?.messages})
        } catch (error) {
            console.log(error);
            set({messages: []})
        } finally {

        }
    },


    subscribeMessages: () => {
        const socket = getSocket();
        if (socket instanceof Error) {
            console.error("Socket error:", socket);
            return;
        }
        socket.on('newMessages', ({message} : any) => {
            set(prev => ({messages: [...prev.messages, message]}))
        })
    },


    unsubscribeFromMessages: () => {
        const socket = getSocket();
        if ('off' in socket) {
            socket.off('newMessages');
        }
    }
}))