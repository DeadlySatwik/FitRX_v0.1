import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

const onboardingQuestions = [
  {
    id: "goal",
    title: "What brings you here?",
    type: "single-select",
    options: [
      "Build muscle",
      "Lose fat",
      "Improve stamina",
      "Stay fit / general health",
      "Gain flexibility & mobility",
    ],
  },
  {
    id: "fitnessLevel",
    title: "How would you describe your current fitness level?",
    type: "single-select",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "personalInfo",
    title: "Tell us about yourself:",
    type: "form",
    fields: [
      {
        id: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Other", "Prefer not to say"],
      },
      { id: "birthdate", label: "Birthdate", type: "date" },
      { id: "height", label: "Height (cm)", type: "number" },
      { id: "weight", label: "Weight (kg)", type: "number" },
    ],
  },
  {
    id: "trainingLocation",
    title: "Where do you plan to train most often?",
    type: "single-select",
    options: ["Home", "Gym", "Outdoors"],
  },
  {
    id: "equipment",
    title: "What equipment do you have access to?",
    type: "multi-select",
    options: [
      "Dumbbells",
      "Resistance bands",
      "Pull-up bar",
      "Kettlebell",
      "Bench",
      "No equipment",
    ],
  },
  {
    id: "focusAreas",
    title: "Are there specific areas you want to focus on?",
    type: "multi-select",
    options: [
      "Chest",
      "Back",
      "Arms",
      "Shoulders",
      "Legs",
      "Core",
      "Full body",
    ],
  },
  {
    id: "limitations",
    title: "Do you have any physical limitations or discomfort?",
    type: "multi-select",
    options: ["Knee pain", "Lower back pain", "Shoulder limitations", "None"],
  },
  {
    id: "trainingDays",
    title: "How many days per week can you train?",
    type: "single-select",
    options: ["2 days", "3 days", "4 days", "5+ days"],
  },
  {
    id: "duration",
    title: "Preferred workout duration per session:",
    type: "single-select",
    options: ["15–20 minutes", "30–45 minutes", "60 minutes"],
  },
  {
    id: "reminders",
    title: "Would you like us to remind or track progress for you?",
    type: "single-select",
    options: ["Yes", "No"],
  },
];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    goal: "",
    fitnessLevel: "",
    personalInfo: { gender: "Male", birthdate: "", height: "", weight: "" },
    trainingLocation: "",
    equipment: [],
    focusAreas: [],
    limitations: [],
    trainingDays: "",
    duration: "",
    reminders: "",
  });
  const [loading, setLoading] = useState(false);

  const totalSteps = onboardingQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = onboardingQuestions[currentStep];

  const handleSingleSelect = (option) => {
    setFormData({ ...formData, [currentQuestion.id]: option });
  };

  const handleMultiSelect = (option) => {
    const currentSelection = formData[currentQuestion.id] || [];
    let newSelection;

    if (option === "None" || option === "No equipment") {
      newSelection = [option];
    } else {
      if (currentSelection.includes(option)) {
        newSelection = currentSelection.filter((item) => item !== option);
      } else {
        newSelection = [
          ...currentSelection.filter(
            (item) => item !== "None" && item !== "No equipment"
          ),
          option,
        ];
      }
    }
    setFormData({ ...formData, [currentQuestion.id]: newSelection });
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [id]: value },
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Submitting onboarding data:", formData);
    // Demo: Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log("Onboarding complete!");
      navigate("/workout"); // Navigate to the main app after completion
    }, 1500);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "single-select":
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSingleSelect(option)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  formData[currentQuestion.id] === option
                    ? "bg-indigo-600 border-indigo-600 text-white font-semibold ring-2 ring-indigo-400"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-gray-600"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case "multi-select":
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleMultiSelect(option)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${
                  formData[currentQuestion.id]?.includes(option)
                    ? "bg-indigo-600 border-indigo-600 text-white font-semibold ring-2 ring-indigo-400"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-gray-600"
                }`}
              >
                <span>{option}</span>
                {formData[currentQuestion.id]?.includes(option) && (
                  <Check className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        );
      case "form":
        return (
          <div className="space-y-4">
            {currentQuestion.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={formData.personalInfo[field.id]}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={formData.personalInfo[field.id]}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col p-4">
      <header className="flex items-center mb-6 h-10 justify-center relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 -ml-2 text-gray-700 dark:text-gray-300"
          onClick={handleBack}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl font-bold">Your Fitness Profile</h2>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <Card className="flex-grow p-6 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-2xl font-semibold text-center mb-6">
            {currentQuestion.title}
          </h3>
          {renderQuestion()}
        </div>

        <div className="mt-8">
          {currentStep < totalSteps - 1 ? (
            <Button size="lg" className="w-full" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Generating Your Plan..." : "Finish & Start Training"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OnboardingScreen;
