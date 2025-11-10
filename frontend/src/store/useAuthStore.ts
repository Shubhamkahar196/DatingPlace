import { create } from "zustand";
import { axiosInstance } from '../lib/axios'
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";
import { AxiosError } from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    age: string;
    gender: string;
    genderPreference: string;
    image?: string;
    bio?: string;
}

interface SignUpResponse {
    user: User;
}

type AuthStore = {
    loading: boolean;
    authUser: User | null;
    checkingAuth: boolean;
    signup: (data: SignProp) => void;
    logout: () => void;
    checkAuth: () => void;
    login: (data: loginProp) => void;
}

type SignProp = {
    name: string,
    email: string,
    password: string,
    age: string,
    gender: string,
    genderPreference: string
}

type loginProp = {
    email: string,
    password: string
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async (signupData: SignProp) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post<SignUpResponse>('/auth/signup', signupData)
            set({ authUser: res.data?.user })
            console.log(res.data?.user._id);
            initializeSocket(res.data?.user._id)
            toast.success('Account created successfully')
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message || 'Something went wrong')
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            set({ loading: false })
        }
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get<SignUpResponse>('/auth/me')
            set({ authUser: res?.data?.user });
            initializeSocket(res.data?.user._id);
        } catch (error) {
            set({ authUser: null })
            console.log(error);
        } finally {
            set({ checkingAuth: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post<SignUpResponse>('/auth/logout');
            disconnectSocket();
            if (res.status === 200) set({ authUser: null })
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message || "Something went wrong")
            } else {
                toast.error("Something went wrong")
            }
        }
    },

    login: async (loginData: loginProp) => {
        try {
            set({ loading: true })
            const res = await axiosInstance.post<SignUpResponse>('/auth/signin', loginData);
            set({ authUser: res.data?.user });
            console.log(res.data?.user._id);
            // initializeSocket(res.data?.user._id);
            toast.success("Login successfully")

        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message || "Something went wrong")
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            set({ loading: false })
        }
    }
}))