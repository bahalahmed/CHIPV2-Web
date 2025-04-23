import { Shield, User, ThumbsUp } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { step: 1, label: "Verification", icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> },
  { step: 2, label: "User Details", icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> },
  { step: 3, label: "Personal Info", icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> },
  { step: 4, label: "Approval", icon: <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" /> },
];

export const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-0 mb-4">
      {steps.map((item, index) => {
        const isCompleted = currentStep > item.step;
        const isCurrent = currentStep === item.step;
        const isLast = index === steps.length - 1;

        return (
          <div key={item.step} className="flex flex-col items-center flex-1 relative">
            {/* Connecting Line */}
            {!isLast && (
              <div className="absolute top-[20px] left-1/2 w-full z-0">
                <div className="h-0.5 w-full bg-secondary relative">
                  <div
                    className={`h-full absolute top-0 left-0 transition-all duration-500 ${
                      currentStep > item.step
                        ? "w-full bg-gradient-to-r from-primary to-primary"
                        : "w-0"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step Circle */}
            <div className="z-10">
              {isCompleted ? (
                <div className="bg-[#3D8C40] w-9 h-9 rounded-full flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : isCurrent ? (
                <div className="bg-primary w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md">
                  {item.icon}
                </div>
              ) : (
                <div className="border-2 border-accent text-accent w-9 h-9 rounded-full flex items-center justify-center bg-white">
                  {item.icon}
                </div>
              )}
            </div>

            {/* Step Label */}
            <span
              className={`mt-1 text-xs sm:text-sm font-medium ${
                isCurrent ? "text-primary" : "text-muted-foreground"
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
