import { Shield, User, ThumbsUp } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { step: 1, label: "Verification", icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
  { step: 2, label: "User Details", icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
  { step: 3, label: "Personal Info", icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
  { step: 4, label: "Approval", icon: <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
];

export const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-between mb-8 px-2 sm:px-4 lg:px-6">
      {steps.map((item, index) => {
        const isCompleted = currentStep > item.step;
        const isCurrent = currentStep === item.step;
        const isLast = index === steps.length - 1;

        return (
          <div key={item.step} className="flex flex-col items-center flex-1 relative">
            {/* Line to next step */}
            {!isLast && (
              <div className="absolute top-[20px] left-1/2 w-full z-0">
                <div className="h-0.5 w-full bg-[#D2D8F3] overflow-hidden relative">
                  <div
                    className={`h-full absolute top-0 left-0 transition-all duration-500 ${
                      currentStep > item.step ? "w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]" : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step Icon */}
            <div className="z-10">
              {isCompleted ? (
                <div className="bg-[#3D8C40] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[var(--white)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="bg-[var(--primary)] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[var(--white)] shadow-md">
                  {item.icon}
                </div>
              ) : (
                <div className="border-2 border-[#5A7AF1] text-[#5A7AF1] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[var(--white)]">
                  {item.icon}
                </div>
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs sm:text-sm md:text-base font-medium ${
                isCurrent ? "text-[var(--primary)]" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
