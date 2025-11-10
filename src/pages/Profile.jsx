import Button from "../components/Button";
import Card from "../components/Card";
import {
  ChevronLeft,
  Settings,
  Sun,
  Moon,
  Flame,
  Shield,
  ChevronRight,
  Edit,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileScreen = ({ theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const handleBackClick = () => navigate(-1);
  return (
    <div className="p-4">
      <header className="flex items-center mb-6 h-10">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 -ml-2 text-gray-700 dark:text-gray-300"
          onClick={handleBackClick}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h2>
        <div className="ml-auto flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300"
            onClick={onThemeToggle}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="space-y-4">
        <Card className="p-6 flex items-center space-x-4">
          <Flame className="w-10 h-10 text-orange-500" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              64
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Longest Streak</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Badges
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex justify-around">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Shield
                className="w-12 h-12 text-orange-400"
                fill="currentColor"
                strokeWidth="1"
                stroke="rgba(0,0,0,0.1)"
              />
              <span className="absolute font-bold text-white text-md">1</span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Shield
                className="w-12 h-12 text-green-400"
                fill="currentColor"
                strokeWidth="1"
                stroke="rgba(0,0,0,0.1)"
              />
              <span className="absolute font-bold text-white text-md">3</span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Shield
                className="w-12 h-12 text-indigo-400"
                fill="currentColor"
                strokeWidth="1"
                stroke="rgba(0,0,0,0.1)"
              />
              <span className="absolute font-bold text-white text-md">7</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { label: "Age", value: "20" },
            { label: "Height", value: "5'8\"" },
            { label: "Current Weight", value: "147 lbs" },
            { label: "Gender", value: "Male" },
            { label: "Activity Level", value: "Moderately Active" },
            { label: "Pace", value: "In the middle" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-3"
            >
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {item.label}
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {item.value}
                </span>
                <Edit className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex justify-between items-center py-3">
            <div>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Goal Weight
              </span>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                160 lbs
              </p>
            </div>
            <Button variant="secondary" size="sm" className="dark:bg-gray-600">
              Change Goal
            </Button>
          </div>
          {[
            { label: "Daily Calorie Goal", value: "2809" },
            { label: "Daily Protein Goal", value: "147" },
            { label: "Daily Fat Goal", value: "99" },
            { label: "Daily Carbs Goal", value: "361" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-3"
            >
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {item.label}
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {item.value}
                </span>
                <Edit className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-2">
            Notification Times
          </h3>
          {[
            { label: "Breakfast Reminder", time: "9:00 AM" },
            { label: "Lunch Reminder", time: "1:00 PM" },
            { label: "Dinner Reminder", time: "6:00 PM" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 -mx-6 px-6"
            >
              <div>
                <span className="text-gray-900 dark:text-white text-sm">
                  {item.label}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {item.time}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
