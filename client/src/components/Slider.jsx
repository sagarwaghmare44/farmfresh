import React, { useState, useEffect } from 'react';

const steps = [
    {
        title: "Getting Started is Easy!",
        description: "Create your profile and embark on a journey to discover the freshest produce."
    },
    {
        title: "Step 01",
        subtitle: "Browse and Select Your Products",
        description: "Explore our diverse range of fresh produce and handpick the items you'd love to purchase."
    },
    {
        title: "Step 02",
        subtitle: "Review Your Selections",
        description: "Take a moment to review your cart and make any necessary adjustments."
    },
    {
        title: "Step 03",
        subtitle: "Savor the Freshness!",
        description: "Your order will arrive at your doorstep, fresh and ready for you to enjoy."
    }
];

function Slider() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    // For progress bar animation
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isPaused) {
            setProgress(0);
            return;
        }

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    return 0;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(progressInterval);
    }, [currentStep, isPaused]);

    // This is the auto-slider feature
    useEffect(() => {
        if (isPaused) return; 
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentStep, isPaused]);

//    For the next slide
    const nextSlide = () => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    };

    // This is for the prevSlider
    const prevSlide = () => {
        setCurrentStep((prevStep) => (prevStep === 0 ? steps.length - 1 : prevStep - 1));
    };

    return (
        <div
            className="relative w-[80vw] max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Slide Content */}
            <div className="relative flex flex-col items-center justify-center p-8 bg-white transition-all duration-500 ease-in-out h-64">
                <h1 className="text-2xl font-bold text-green-600">{steps[currentStep].title}</h1>
                {steps[currentStep].subtitle && (
                    <h2 className="text-lg font-semibold text-green-500 mt-2">{steps[currentStep].subtitle}</h2>
                )}
                <p className="text-md text-gray-700 text-center mt-4">{steps[currentStep].description}</p>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl md:text-2xl text-gray-700 hover:text-green-500 focus:outline-none"
            >
                &#10094; {/* Left arrow */}
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl md:text-2xl text-gray-700 hover:text-green-500 focus:outline-none"
            >
                &#10095; {/* Right arrow */}
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {steps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-green-500' : 'bg-gray-400'} transition duration-300`}
                    ></button>
                ))}
            </div>
        </div>
    );
}

export default Slider;
