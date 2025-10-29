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