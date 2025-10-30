import {Heart} from 'lucide-react';

const NoMatchesFound = () => (
    <div className='flex flex-col items-center justify-center h-full text-center'>
        <Heart className='text-pink-400 mb-4' size={48}/>
        <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Matches Yet</h3>
        <p className='text-gray-500 max-w-xs'>
            Don&apos;t worry! Your perfect match is just around the corner. Keep swiping!
        </p>
    </div>
)

export default NoMatchesFound