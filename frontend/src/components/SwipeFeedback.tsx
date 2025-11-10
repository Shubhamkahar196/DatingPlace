import { useMatchStore } from "../store/useMatchStore";

const swipeFeedbackStyle = (swipeFeedback : string) => {
    if(swipeFeedback === 'liked') return 'text-green-500';
    if(swipeFeedback === 'passed') return 'text-red-500';
    if(swipeFeedback === 'matched') return 'text-pink-500';
}

const swipeFeedbackText = (swipeFeedback : string) => {

    if(swipeFeedback === 'liked') return "Liked!";
    if(swipeFeedback === 'passed') return 'Passed!';
    if(swipeFeedback === 'matched') return 'Matched!';
}

const SwipeFeedback = () => {

    const {swipeFeedback} = useMatchStore()

    return (
        <div className={`
            absolute top-10 left-0 right-0 text-2xl text-center ${swipeFeedbackStyle(swipeFeedback)}
        `}>
           {swipeFeedbackText(swipeFeedback)} 
        </div>
    )
}

export default SwipeFeedback;