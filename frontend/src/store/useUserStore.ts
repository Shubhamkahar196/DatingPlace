import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type uploadProfileProp = {
    name: string, 
    bio: string,
    age: string,
    gender: string,
    genderPreference: string,
    image: string
}

type UserStore = {
    loading: boolean;
    uploadProfile: ({}: any) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    loading: false,

    uploadProfile: async (data: uploadProfileProp) => {
        try {
            set({loading:true});
            await axiosInstance.put('/user/update', data);
            toast.success('Account updated successfully')
        } catch (error: any) {
            toast.error(error.res.data.message || 'Something went wrong')
        } finally {
            set({loading: false});
        }
    }
}))