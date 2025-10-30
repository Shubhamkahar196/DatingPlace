import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [genderPreference, setGenderPreference] = useState("");


    const {signup, loading} = useAuthStore()

    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                signup({name,email,password, age, gender, genderPreference});
            }}>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <div className="mt-1">
                    <input
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input 
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input 
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>


            <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                </label>
                <div className="mt-1">
                    <input 
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        id="age"
                        name="age"
                        type="number"
                        required
                        placeholder="Enter your Age"
                        min='18'
                        max='120'
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
            </div>


            <div>
                <label className="block text-sm font-medium text-ray-700">
                    Your Gender
                </label>
                <div className="mt-2 flex gap-2">
                    <div className="flex items-center">
                        <input 
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            id="male"
                            name="gender"
                            type="checkbox"
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                        />
                        <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
                            Male
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input 
                                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                id="female"
                                name="gender"
                                type="checkbox"
                                checked={gender === "female"}
                                onChange={() => setGender("female")}
                            />
                        <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
                            Female
                        </label>
                    </div>
                </div>   
            </div>
            

            <div>
                <label className="block text-sm font-medium text-gray-700"> Prefer Me</label>
                <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                        <input 
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            id='prefer-male'
                            name='gender-preference'
                            type='radio'
                            value='male'
                            checked={genderPreference === 'male'}
                            onChange={(e) => setGenderPreference(e.target.value)}
                        />
                        <label htmlFor="prefer-male" className="ml-2 block text-sm text-gray-900">
                            Male
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input 
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            id='prefer-female'
                            name='gender-preference'
                            type='radio'
                            value='female'
                            checked={genderPreference === 'female'}
                            onChange={(e) => setGenderPreference(e.target.value)}
                        />
                        <label htmlFor="prefer-female" className="ml-2 block text-sm text-gray-900">
                            Female
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input 
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            id='prefer-both'
                            name='gender-preference'
                            type='radio'
                            value='both'
                            checked={genderPreference === 'both'}
                            onChange={(e) => setGenderPreference(e.target.value)}
                        />
                        <label htmlFor="prefer-both" className="ml-2 block text-sm text-gray-900">
                            Both
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <button 
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading ? 
                            "bg-pink-400 cursor-not-allowed"
                            : "bg-pink-400 hover:bg-pink-700 focus: outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Signing up ..." : "Sign up"}
                </button>
            </div>
        </form>
    )
}

export default SignUpForm;