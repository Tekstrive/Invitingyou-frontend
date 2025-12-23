import { useNavigate } from "react-router-dom";
import { Save, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface EditorHeaderProps {
  currentStep: number;
  eventId: string;
  saveStatus?: "idle" | "saving" | "saved" | "error";
  onSaveDraft?: () => void;
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean;
}

const steps = [
  { number: 1, label: "Design", path: "design" },
  { number: 2, label: "Details", path: "details" },
  { number: 3, label: "Guests", path: "guests" },
  { number: 4, label: "Review", path: "review" },
  { number: 5, label: "Send", path: "send" },
];

export const EditorHeader = ({
  currentStep,
  eventId,
  saveStatus = "idle",
  onSaveDraft,
  onNext,
  onBack,
  canProceed = true,
}: EditorHeaderProps) => {
  const navigate = useNavigate();
  const progress = (currentStep / steps.length) * 100;

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed or current step
    if (stepNumber <= currentStep) {
      const step = steps.find((s) => s.number === stepNumber);
      if (step) {
        navigate(`/event/${eventId}/${step.path}`);
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-brand-mirage">InvitingYou</h1>
          </div>

          {/* Step Indicators - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={step.number > currentStep}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                    step.number === currentStep &&
                      "bg-brand-orange text-white ring-4 ring-brand-orange/20",
                    step.number < currentStep &&
                      "bg-green-500 text-white hover:bg-green-600 cursor-pointer",
                    step.number > currentStep &&
                      "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {step.number < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={cn(
                    "ml-2 text-sm font-medium",
                    step.number === currentStep && "text-brand-orange",
                    step.number < currentStep && "text-green-600",
                    step.number > currentStep && "text-gray-400"
                  )}
                >
                  {step.label}
                </span>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <svg
                    className="w-5 h-5 mx-3 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden flex items-center">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Save Status */}
            {saveStatus !== "idle" && (
              <div className="flex items-center text-sm">
                {saveStatus === "saving" && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-orange mr-2"></div>
                    <span className="text-gray-500">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <span className="text-red-500">Save failed</span>
                )}
              </div>
            )}

            {/* Save Draft Button */}
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              {currentStep > 1 && onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              )}

              {currentStep < steps.length && onNext && (
                <button
                  onClick={onNext}
                  disabled={!canProceed}
                  className={cn(
                    "px-6 py-2 text-sm font-medium text-white rounded-sm transition-colors",
                    canProceed
                      ? "bg-brand-orange hover:bg-brand-orange/90"
                      : "bg-gray-300 cursor-not-allowed"
                  )}
                >
                  {currentStep === steps.length - 1 ? "Send" : "Next"} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-brand-orange transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
