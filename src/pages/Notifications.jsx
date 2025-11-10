import Button from "../components/Button";
import Card from "../components/Card";
import {
  ChevronLeft,
  Calendar,
  Award,
  TrendingUp,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const notifications = [
    {
      icon: Calendar,
      title: "Workout Reminder",
      message: "Time for your Pull Day!",
      time: "2h ago",
      unread: true,
      color: "indigo",
    },
    {
      icon: Award,
      title: "Achievement Unlocked",
      message: "50 workouts done! 🎉",
      time: "5h ago",
      unread: true,
      color: "yellow",
    },
    {
      icon: TrendingUp,
      title: "New PR",
      message: "Bench Press +5kg!",
      time: "1d ago",
      unread: false,
      color: "green",
    },
    {
      icon: FileText,
      title: "Plan Updated",
      message: "Your next week's plan is ready.",
      time: "2d ago",
      unread: false,
      color: "blue",
    },
  ];

  const colorClasses = {
    indigo:
      "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
  };

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
          Notifications
        </h2>
      </header>
      <div className="space-y-3">
        {notifications.map((notif, i) => {
          const Icon = notif.icon;
          return (
            <Card
              key={i}
              className={`p-4 flex items-start space-x-3 ${
                notif.unread ? "bg-indigo-50 dark:bg-gray-700" : ""
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  colorClasses[notif.color]
                } flex-shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm">{notif.title}</h4>
                  {notif.unread && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {notif.time}
                </p>
              </div>
            </Card>
          );
        })}
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
