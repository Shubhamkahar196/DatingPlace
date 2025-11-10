import { Frown } from "lucide-react";

const NoMoreProfiles = () => (
	<div className='flex flex-col items-center justify-center h-full text-center p-8'>
		<Frown className='text-pink-400 mb-6' size={80} />
		<h2 className='text-3xl font-bold text-gray-800 mb-4'>Woah there, speedy fingers!</h2>
		<p className='text-xl text-gray-600 mb-6'>Bro are you OK? Maybe it&apos;s time to touch some grass.</p>
	</div>
);
export default NoMoreProfiles;