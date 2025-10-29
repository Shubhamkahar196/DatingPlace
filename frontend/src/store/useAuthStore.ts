import {create} from 'zustand'
import toast from 'react-hot-toast'

interface SignUpResponse {
    user: {
        _id: string
    }
}

type AuthStore = {
    loading: boolean;
    authUser: any;
    checkingAuth: boolean;
    signup: ({}: SignProp) => void;
    logout: ()=> void;
    checkAuth: () => void;
    login: ({}: loginProp) => void;
}

type SignProp = {
    name: String,
    email: String,
    password: String,
    age: String,
    gender: String,
    genderPreference: String
}

type loginProp = {
    email: String,
    password: String
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async (signupDate: SignProp) => {
        try {
            set({ loading: true})
            const res = await axiosInstance.post<SignUpResponse>('/auth/signup', signupDate)
            set({authUser: res.data?.user})
            console.log(res.data?.user._id);
            
        } catch (error) {
            
        }
    }
}))