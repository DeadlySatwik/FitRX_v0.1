import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import BottomNav from "./components/BottomNav";
import {
  CalorieDashboardScreen,
  CalorieDetailScreen,
  AddFoodModal,
} from "./pages/Nutrition";
import {
  WorkoutScreen,
  WorkoutExecutionScreen,
  WorkoutHistoryScreen,
} from "./pages/Workout";
import ChatbotScreen from "./pages/Chatbot";
import ProfileScreen from "./pages/Profile";
import SettingsScreen from "./pages/Settings";
import NotificationsScreen from "./pages/Notifications";
import ProgressScreen from "./pages/Progress";
import LoginScreen from "./pages/Login";
import OnboardingScreen from "./pages/Onboarding";
import SignupScreen from "./pages/Signup";

import { getDayLabel } from "./utils/dates";

// (Image analysis handlers live in the Nutrition page's AddFoodModal component.)
// Sample mock data for nutrition views
const MOCK_MEALS = [
  {
    id: 1,
    name: "Oatmeal with Berries",
    category: "Breakfast",
    time: "08:15 AM",
    calories: 320,
    photoUrl: "",
  },
  {
    id: 2,
    name: "Chicken Salad",
    category: "Lunch",
    time: "12:45 PM",
    calories: 520,
    photoUrl: "",
  },
  {
    id: 3,
    name: "Greek Yogurt",
    category: "Snack",
    time: "03:30 PM",
    calories: 150,
    photoUrl: "",
  },
  {
    id: 4,
    name: "Grilled Salmon & Quinoa",
    category: "Dinner",
    time: "07:10 PM",
    calories: 640,
    photoUrl: "",
  },
];

const dayMs = 24 * 60 * 60 * 1000;
const today = new Date();

const MOCK_DAYS_DATA = [
  {
    id: "d0",
    date: today,
    calories: 1630,
    goal: 2200,
    maintenance: 2200,
    macros: {
      protein: { consumed: 110, goal: 160 },
      carbs: { consumed: 210, goal: 300 },
      fats: { consumed: 50, goal: 70 },
    },
    meals: [MOCK_MEALS[0], MOCK_MEALS[1], MOCK_MEALS[2]],
  },
  {
    id: "d1",
    date: new Date(today.getTime() - dayMs),
    calories: 2050,
    goal: 2200,
    maintenance: 2200,
    macros: {
      protein: { consumed: 140, goal: 160 },
      carbs: { consumed: 260, goal: 300 },
      fats: { consumed: 65, goal: 70 },
    },
    meals: [MOCK_MEALS[3]],
  },
  {
    id: "d2",
    date: new Date(today.getTime() - 2 * dayMs),
    calories: 1900,
    goal: 2200,
    maintenance: 2200,
    macros: {
      protein: { consumed: 95, goal: 160 },
      carbs: { consumed: 240, goal: 300 },
      fats: { consumed: 55, goal: 70 },
    },
    meals: [],
  },
  {
    id: "d3",
    date: new Date(today.getTime() - 3 * dayMs),
    calories: 2300,
    goal: 2200,
    maintenance: 2200,
    macros: {
      protein: { consumed: 165, goal: 160 },
      carbs: { consumed: 330, goal: 300 },
      fats: { consumed: 80, goal: 70 },
    },
    meals: [],
  },
];

// --- MAIN APP COMPONENT (Router Logic) ---

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [daysData, setDaysData] = useState(MOCK_DAYS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("fitrx-theme");
      if (stored === "dark" || stored === "light") return stored;
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      )
        return "dark";
    } catch (e) {
      void e; // ignore (localStorage or matchMedia not available)
    }
    return "light";
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("fitrx-theme", theme);
    } catch (e) {
      void e; // ignore (localStorage may be blocked)
    }
  }, [theme]);

  // No manual navigation functions — components should use react-router's hooks/links directly.

  const handleLogFood = (newMeal) => {
    setDaysData((prevData) => {
      const currentData = Array.isArray(prevData) ? prevData : [];
      return currentData.map((day) => {
        if (getDayLabel(day.date) === "Today") {
          const currentMeals = Array.isArray(day.meals) ? day.meals : [];
          const currentCalories =
            typeof day.calories === "number" ? day.calories : 0;
          const newMealCalories =
            typeof newMeal.calories === "number" ? newMeal.calories : 0;

          // also update macros if provided on the meal
          const macros = day.macros || {};
          const proteinConsumed = macros?.protein?.consumed || 0;
          const carbsConsumed = macros?.carbs?.consumed || 0;
          const fatsConsumed = macros?.fats?.consumed || 0;

          const addedProtein =
            typeof newMeal.protein === "number" ? newMeal.protein : 0;
          const addedCarbs =
            typeof newMeal.carbs === "number" ? newMeal.carbs : 0;
          const addedFats = typeof newMeal.fats === "number" ? newMeal.fats : 0;

          return {
            ...day,
            calories: currentCalories + newMealCalories,
            macros: {
              protein: {
                ...(macros.protein || {}),
                consumed: proteinConsumed + addedProtein,
                goal: macros?.protein?.goal || 0,
              },
              carbs: {
                ...(macros.carbs || {}),
                consumed: carbsConsumed + addedCarbs,
                goal: macros?.carbs?.goal || 0,
              },
              fats: {
                ...(macros.fats || {}),
                consumed: fatsConsumed + addedFats,
                goal: macros?.fats?.goal || 0,
              },
            },
            meals: [newMeal, ...currentMeals],
          };
        }
        return day;
      });
    });
  };

  const handleThemeToggle = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleProfileClick = () => navigate("/profile");
  const handleBack = () => navigate(-1);

  // Header and footer visibility/title decisions
  const getHeaderProps = () => {
    const path = location.pathname;
    // Hide header for pages that render their own header
    if (
      path.startsWith("/profile") ||
      path.startsWith("/settings") ||
      path.startsWith("/notifications") ||
      path.startsWith("/progress")
    ) {
      return { requiresHeader: false };
    }

    // Nutrition detail path: /nutrition/:id
    const detailMatch = path.match(/^\/nutrition\/(.+)/);
    if (detailMatch) {
      const dayId = detailMatch[1];
      const day = daysData.find((d) => d.id === dayId);
      const title = day ? getDayLabel(day.date) : "Nutrition";
      return {
        requiresHeader: true,
        title,
        showBack: true,
        requiresFooter: false,
      };
    }

    // Default titles for main tabs
    if (path.startsWith("/workout"))
      return {
        requiresHeader: true,
        title: "Workout",
        requiresFooter: path === "/workout",
      };
    if (path.startsWith("/nutrition"))
      return {
        requiresHeader: true,
        title: "Nutrition",
        requiresFooter: path === "/nutrition",
      };
    if (path.startsWith("/chatbot"))
      return {
        requiresHeader: true,
        title: "AI Chat",
        requiresFooter: path === "/chatbot",
      };

    // For login/onboarding routes, show no standard header/footer
    if (
      path.startsWith("/login") ||
      path.startsWith("/onboarding") ||
      path.startsWith("/signup")
    )
      return { requiresHeader: false, requiresFooter: false };

    return { requiresHeader: true, title: "FitRX", requiresFooter: true };
  };

  const headerProps = getHeaderProps();

  // Wrapper to feed the detail screen the correct day object or redirect
  const NutritionDetailRoute = () => {
    const { dayId } = useParams();
    const day = daysData.find((d) => d.id === dayId);
    if (!day) return <Navigate to="/nutrition" replace />;
    return <CalorieDetailScreen day={day} />;
  };

  return (
    <div className={`font-sans`}>
      <div className="max-w-md mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl flex flex-col overflow-hidden">
        {headerProps.requiresHeader && (
          <AppHeader
            title={headerProps.title}
            onProfileClick={handleProfileClick}
            onBackClick={handleBack}
            showBack={headerProps.showBack}
            theme={theme}
            onThemeToggle={handleThemeToggle}
          />
        )}

        <main
          className={`flex-grow overflow-y-auto ${
            headerProps.requiresFooter
              ? "[padding-bottom:calc(4.5rem+env(safe-area-inset-bottom))]"
              : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/nutrition" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />

            <Route
              path="/nutrition"
              element={
                <CalorieDashboardScreen
                  daysData={daysData}
                  onSelectDay={(day) => navigate(`/nutrition/${day.id}`)}
                  onAddFood={() => setIsModalOpen(true)}
                />
              }
            />
            <Route
              path="/nutrition/:dayId"
              element={<NutritionDetailRoute />}
            />

            <Route path="/workout" element={<WorkoutScreen />} />
            <Route
              path="/workout/execution"
              element={<WorkoutExecutionScreen />}
            />
            <Route path="/workout/history" element={<WorkoutHistoryScreen />} />

            <Route path="/chatbot" element={<ChatbotScreen />} />

            <Route
              path="/profile"
              element={
                <ProfileScreen
                  theme={theme}
                  onThemeToggle={handleThemeToggle}
                />
              }
            />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/progress" element={<ProgressScreen />} />
          </Routes>
        </main>

        {/* Footer (main tabs) */}
        {headerProps.requiresFooter && <BottomNav />}

        {/* Add Food Modal */}
        {isModalOpen && (
          <AddFoodModal
            onClose={() => setIsModalOpen(false)}
            onLogFood={handleLogFood}
          />
        )}
      </div>
    </div>
  );
}
