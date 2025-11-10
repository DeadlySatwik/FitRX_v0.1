import Button from "../components/Button";
import Card from "../components/Card";
import {
  CheckCircle,
  Heart,
  ChevronLeft,
  Play,
  SkipForward,
  Info,
  Zap,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const WorkoutScreen = () => {
  const navigate = useNavigate();
  const workoutPlan = [
    { day: "Monday", type: "Upper Body", completed: true },
    { day: "Tuesday", type: "Lower Body", completed: true },
    { day: "Wednesday", type: "Rest Day", isRest: true, completed: true },
    { day: "Thursday", type: "Push Day", completed: true },
    { day: "Friday", type: "Pull Day", isToday: true, completed: false },
    { day: "Saturday", type: "Legs & Core", completed: false },
    { day: "Sunday", type: "Rest Day", isRest: true, completed: false },
  ];

  return (
    <div className="p-4 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Workout Plan
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/workout/history")}
          >
            History
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Current Week
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Oct 27 - Nov 02
          </span>
        </div>
        <Button variant="outline" size="sm" className="w-full mb-4">
          Generate New Plan
        </Button>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          This Week's Schedule
        </h3>
        {workoutPlan.map((workout, i) => (
          <Card
            key={i}
            className={`p-4 ${workout.isToday ? "ring-2 ring-indigo-500" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {workout.day}
                  </h4>
                  {workout.isToday && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                      Today
                    </span>
                  )}
                  {workout.completed && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p
                  className={`text-sm ${
                    workout.isRest
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {workout.type}
                </p>
              </div>
              {!workout.isRest && (
                <Button
                  size="sm"
                  onClick={() => navigate("/workout/execution")}
                >
                  {workout.completed ? "Review" : "Start"}
                </Button>
              )}
              {workout.isRest && <Heart className="w-5 h-5 text-gray-500" />}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const WorkoutExecutionScreen = () => {
  const navigate = useNavigate();
  const currentExercise = {
    name: "Bench Press",
    setsReps: "4 sets × 8 reps",
    cues: ["Feet flat", "Slight arch", "Bar to mid-chest", "Control"],
  };
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = 4;

  const completeSet = () => {
    if (currentSet < totalSets) setCurrentSet((s) => s + 1);
    else navigate("/workout");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between sticky top-0 z-10 h-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/workout")}
          className="text-white hover:bg-white/10 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Upper Body</h1>
          <p className="text-indigo-100 text-xs">Exercise 1 of 4</p>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900">
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center relative shadow-md">
          <Play className="w-12 h-12 text-gray-600 dark:text-gray-400" />
        </div>

        <Card className="p-4">
          <h2 className="text-xl font-bold mb-1">{currentExercise.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {currentExercise.setsReps}
          </p>

          <div className="bg-indigo-50 dark:bg-gray-700 border border-indigo-200 dark:border-gray-600 rounded p-3 mb-4">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm mb-1 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Form Cues
            </h4>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-indigo-700 dark:text-indigo-300">
              {currentExercise.cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>

          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Sets Completed
          </label>
          <div className="flex justify-around mb-4">
            {Array.from({ length: totalSets }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 ${
                  i + 1 <= currentSet
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300 dark:border-gray-600"
                } flex items-center justify-center transition-colors`}
              >
                {i + 1 <= currentSet && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-yellow-100 dark:bg-gray-700 border border-yellow-300 dark:border-gray-600 rounded p-3 text-center mb-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm mb-1">
              Rest Timer
            </h4>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
              01:30
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate("/workout")}>
              <SkipForward className="w-4 h-4 mr-2" /> Skip Ex.
            </Button>
            <Button onClick={completeSet}>
              <CheckCircle className="w-4 h-4 mr-2" /> Set {currentSet} Done
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const WorkoutHistoryScreen = () => {
  const navigate = useNavigate();
  const history = [
    {
      date: "Oct 24, 2025",
      type: "Push Day",
      duration: "45 min",
      calories: 310,
    },
    {
      date: "Oct 23, 2025",
      type: "Lower Body",
      duration: "50 min",
      calories: 380,
    },
    {
      date: "Oct 21, 2025",
      type: "Upper Body",
      duration: "45 min",
      calories: 295,
    },
  ];

  return (
    <div className="p-4">
      <header className="flex items-center mb-6 h-10">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 -ml-2 text-gray-700 dark:text-gray-300"
          onClick={() => navigate("/workout")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Workout History
        </h2>
      </header>
      <div className="space-y-4">
        {history.map((item, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.type}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.date}
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Details
              </Button>
            </div>
            <div className="flex justify-around text-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div>
                <Clock className="w-3 h-3 inline mr-1" />
                {item.duration}
              </div>
              <div>
                <Zap className="w-3 h-3 inline mr-1 text-orange-500" />
                {item.calories} kcal
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
