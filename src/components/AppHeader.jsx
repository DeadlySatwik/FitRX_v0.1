import Button from "./Button";
import { ChevronLeft, User, Sun, Moon } from "lucide-react";
import Logo from "../assets/Logo.png";

const AppHeader = ({
  title,
  onProfileClick,
  onBackClick,
  showBack = false,
  theme,
  onThemeToggle,
}) => (
  <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-4 h-16 flex items-center justify-between">
    <div className="flex items-center space-x-2">
      {showBack ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="-ml-2 text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      ) : (
        <img
          src={Logo}
          alt="FitRX Logo"
          className="w-8 h-8 rounded-lg object-contain"
        />
      )}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        {title || "FitRX"}
      </h1>
    </div>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onThemeToggle}
        className="text-gray-700 dark:text-gray-300"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onProfileClick}
        aria-label="Profile"
      >
        <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </Button>
    </div>
  </header>
);

export default AppHeader;
