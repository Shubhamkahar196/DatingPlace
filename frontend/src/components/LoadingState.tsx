import { Loader } from "lucide-react";

const LoadingState = () => (
	<div className='flex flex-col items-center justify-center h-full text-center'>
		<Loader className='text-pink-500 mb-4 animate-spin' size={48} />
		<h3 className='text-xl font-semibold text-gray-700 mb-2'>Loading Matches</h3>
		<p className='text-gray-500 max-w-xs'>We&apos;re finding your perfect matches. This might take a moment...</p>
	</div>
);

export default LoadingState;