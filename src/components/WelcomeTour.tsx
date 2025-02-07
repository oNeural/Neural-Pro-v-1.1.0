import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, FileText, Edit2, Users2, Download, Play } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: typeof FileText;
}

const steps: Step[] = [
  {
    title: "Hey There! Welcome to Neural Pro+ 👋",
    description: "We're super excited to help you turn your audio and video into amazing transcripts! Our AI is here to make your life easier.",
    icon: FileText
  },
  {
    title: "Smart Audio Controls 🎵",
    description: "Play, pause, speed up, or slow down - it's all here! Plus, you can see those cool audio waves as you listen.",
    icon: Play
  },
  {
    title: "AI Magic at Work ✨",
    description: "Our smart AI automatically figures out who's talking and makes your transcript look super clean. No more manual formatting!",
    icon: Edit2
  },
  {
    title: "Speaker Detection 🎭",
    description: "Multiple people talking? No worries! We'll tag each speaker automatically, making your transcripts crystal clear.",
    icon: Users2
  },
  {
    title: "Easy Sharing 🚀",
    description: "Done with your transcript? Export it any way you like! Perfect for sharing with your team or keeping for yourself.",
    icon: Download
  }
];

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeTour = ({ isOpen, onClose }: WelcomeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTour', 'true');
    onClose();
    setCurrentStep(0);
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-gray-900 rounded-xl shadow-2xl">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-gray-200">
                Welcome to Neural Pro+
              </Dialog.Title>
              <button
                onClick={() => {
                  localStorage.setItem('hasSeenTour', 'true');
                  onClose();
                  setCurrentStep(0);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full"></div>
                <div className="relative bg-gray-800 p-6 rounded-full border border-cyan-500/30">
                  <CurrentIcon className="w-12 h-12 text-cyan-500" />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-200 text-center mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-400 text-center mb-8">
              {steps[currentStep].description}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-cyan-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('hasSeenTour', 'true');
                    onClose();
                    setCurrentStep(0);
                  }}
                  className="btn-secondary"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
