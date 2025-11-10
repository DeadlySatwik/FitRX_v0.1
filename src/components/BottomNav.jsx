import { Dumbbell, PieChart, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const BottomNav = () => {
  const navItems = [
    { id: "workout", label: "Workout", icon: Dumbbell, to: "/workout" },
    { id: "nutrition", label: "Nutrition", icon: PieChart, to: "/nutrition" },
    { id: "chatbot", label: "Chatbot", icon: MessageCircle, to: "/chatbot" },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] [padding-bottom:env(safe-area-inset-bottom)]">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full rounded-lg transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "font-bold" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
