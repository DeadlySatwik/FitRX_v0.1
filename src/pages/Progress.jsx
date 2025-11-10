import Button from "../components/Button";
import Card from "../components/Card";
import { ChevronLeft, BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProgressScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <header className="flex items-center mb-6 h-10">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 -ml-2 text-gray-700 dark:text-gray-300"
          onClick={() => navigate("/profile")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Progress
        </h2>
      </header>
      <div className="space-y-4">
        <Card className="p-4 grid grid-cols-2 gap-4">
          <div className="text-center border-r border-gray-200 dark:border-gray-700 pr-4">
            <BarChart3 className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
            <p className="text-xl font-bold">48</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Workouts
            </p>
          </div>
          <div className="text-center">
            <Zap className="w-6 h-6 mx-auto text-orange-500 mb-1" />
            <p className="text-xl font-bold">12.4k</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Calories Burned
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Strength Index Trend</h3>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Workout Completion</h3>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Body Measurements</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Weight: 70kg, BMI: 22.9
          </p>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Update Measurements
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ProgressScreen;
