import Button from "../components/Button";
import Card from "../components/Card";
import Progress from "../components/Progress";
import CircularProgress from "../components/CircularProgress";
import { Camera, Plus, X, ImageUp, Loader2 } from "lucide-react";
import { formatDate, getDayLabel } from "../utils/dates";
import { useState, useRef, useEffect } from "react";
import { analyzeFoodImage } from "../utils/gemini";

export const TodaySummary = ({ day, onAddFood, onSelect }) => {
  const displayDay = day || {
    calories: 0,
    goal: 2000,
    maintenance: 2000,
    date: new Date(),
  };
  const consumedPercent = (displayDay.calories / displayDay.goal) * 100;

  return (
    // make the card clickable to view today's detail
    <Card className="p-6 cursor-pointer" onClick={() => onSelect?.(displayDay)}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Today
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatDate(displayDay.date, { month: "long", day: "numeric" })}
          </p>
        </div>
        <Button size="sm" onClick={onAddFood}>
          <Plus className="w-4 h-4 mr-2" />
          Add Food
        </Button>
      </div>

      <div className="flex items-center justify-around gap-6">
        <div className="relative flex items-center justify-center">
          <CircularProgress
            percentage={consumedPercent}
            size={140}
            strokeWidth={12}
            color="rgb(99, 102, 241)"
          />
          <div className="absolute text-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {displayDay.calories}
            </span>
            <span className="text-gray-600 dark:text-gray-300 block">
              / {displayDay.goal} kcal
            </span>
          </div>
        </div>

        <div className="space-y-3 text-left">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300 block">
              Maintenance
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {displayDay.maintenance} kcal
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300 block">
              Your Goal
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {displayDay.goal} kcal
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const DayHistoryCard = ({ day, onSelect }) => {
  const consumedPercent = (day.calories / day.goal) * 100;
  const isOver = day.calories > day.goal;
  const colorClass = isOver ? "bg-red-500" : "bg-green-500";

  return (
    <div
      onClick={() => onSelect(day)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 w-36 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-lg"
    >
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {formatDate(day.date, { month: "short", day: "numeric" })}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {getDayLabel(day.date)}
        </p>
        <Progress value={consumedPercent} colorClass={colorClass} />
        <p className="text-sm text-gray-900 dark:text-white mt-2 font-medium">
          {day.calories}
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {" "}
            / {day.goal} kcal
          </span>
        </p>
      </div>
    </div>
  );
};

export const CalorieDashboardScreen = ({
  daysData,
  onSelectDay,
  onAddFood,
}) => {
  const validDaysData = Array.isArray(daysData) ? daysData : [];
  const todayData = validDaysData.find((d) => getDayLabel(d.date) === "Today");
  const historyData = validDaysData.filter(
    (d) => getDayLabel(d.date) !== "Today"
  );

  return (
    <div className="p-4 space-y-6">
      <TodaySummary
        day={todayData}
        onAddFood={onAddFood}
        onSelect={onSelectDay}
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        History
      </h3>
      <div className="flex gap-4 pb-4 overflow-x-auto -mx-4 px-4">
        {historyData.map((day) => (
          <DayHistoryCard key={day.id} day={day} onSelect={onSelectDay} />
        ))}
      </div>
    </div>
  );
};

export const MacroProgress = ({
  label,
  consumed = 0,
  goal = 1,
  colorClass,
}) => {
  const safeGoal = goal === 0 ? 1 : goal;
  const percent = (consumed / safeGoal) * 100;
  return (
    <Card className="p-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {consumed}g / {safeGoal}g
        </span>
      </div>
      <Progress value={percent} colorClass={colorClass} />
    </Card>
  );
};

export const MealCard = ({ meal }) => (
  <div className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-xl gap-4 shadow-lg">
    {meal.photoUrl ? (
      <img
        src={meal.photoUrl}
        alt={meal.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
        onError={(e) =>
          (e.target.src =
            "https://placehold.co/100x100/A3BFD1/1C2031?text=Food")
        }
      />
    ) : (
      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <Camera className="w-8 h-8 text-gray-600 dark:text-gray-300" />
      </div>
    )}
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-900 dark:text-white">
        {meal.name}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {meal.category} • {meal.time}
      </p>
    </div>
    <div className="text-right">
      <span className="font-bold text-gray-900 dark:text-white">
        {meal.calories}
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-300 block">
        kcal
      </span>
    </div>
  </div>
);

export const CalorieDetailScreen = ({ day }) => {
  const displayDay = day || {
    calories: 0,
    goal: 2000,
    macros: { protein: {}, carbs: {}, fats: {} },
    meals: [],
    date: new Date(),
  };
  const { calories, goal, macros, meals } = displayDay;
  const validMeals = Array.isArray(meals) ? meals : [];

  const groupedMeals = validMeals.reduce((acc, meal) => {
    if (meal && meal.category) {
      (acc[meal.category] = acc[meal.category] || []).push(meal);
    }
    return acc;
  }, {});

  const mealCategories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Pre-Workout",
    "Post-Workout",
  ];

  const defaultMacro = { consumed: 0, goal: 1 };
  const proteinData = macros?.protein || defaultMacro;
  const carbsData = macros?.carbs || defaultMacro;
  const fatsData = macros?.fats || defaultMacro;

  return (
    <div className="p-4">
      <Card className="p-5 text-center mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-300 block">
          Total Calories
        </span>
        <div className="flex justify-center items-baseline gap-2">
          <span
            className={`text-4xl font-bold ${
              calories > goal ? "text-red-500" : "text-gray-900 dark:text-white"
            }`}
          >
            {calories}
          </span>
          <span className="text-xl text-gray-600 dark:text-gray-300">
            / {goal} kcal
          </span>
        </div>
      </Card>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Macronutrients
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MacroProgress
          label="Protein"
          consumed={proteinData.consumed}
          goal={proteinData.goal}
          colorClass="bg-sky-500"
        />
        <MacroProgress
          label="Carbs"
          consumed={carbsData.consumed}
          goal={carbsData.goal}
          colorClass="bg-amber-500"
        />
        <MacroProgress
          label="Fats"
          consumed={fatsData.consumed}
          goal={fatsData.goal}
          colorClass="bg-pink-500"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Logged Meals
      </h3>
      <div className="space-y-6">
        {mealCategories.map((category) =>
          groupedMeals[category] ? (
            <div key={category}>
              <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {category}
              </h4>
              <div className="space-y-3">
                {groupedMeals[category].map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </div>
          ) : null
        )}
        {validMeals.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No meals logged for this day yet.
          </p>
        )}
      </div>
    </div>
  );
};

export const AddFoodModal = ({ onClose, onLogFood }) => {
  const [step, setStep] = useState("start");
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Lunch");
  const [foundItems, setFoundItems] = useState([
    { id: 1, name: "Chicken Breast", amount: "100g" },
    { id: 2, name: "Broccoli", amount: "1 cup" },
    { id: 3, name: "Olive Oil", amount: "1 tbsp" },
  ]);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);

  // Trigger the file picker for camera / gallery actions
  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStep("uploading");

    // create a preview URL so we can show the uploaded photo in the confirm step
    try {
      const preview = URL.createObjectURL(file);
      // revoke any previous preview
      if (uploadedPhotoUrl) URL.revokeObjectURL(uploadedPhotoUrl);
      setUploadedPhotoUrl(preview);

      const analysisResult = await analyzeFoodImage(file);
      if (analysisResult && Array.isArray(analysisResult.items)) {
        const items = analysisResult.items.map((item, index) => ({
          id: Date.now() + index,
          name: item.name || "Unknown",
          amount: item.amount || "",
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fats: item.fats || 0,
        }));
        setFoundItems(items);
        setStep("confirm");
      } else {
        alert("Could not analyze image. Please try again.");
        setStep("start");
      }
    } catch (err) {
      console.error("Error analyzing image", err);
      alert("Could not analyze image. Please try again.");
      setStep("start");
    } finally {
      // finished
    }
  };

  const handleLog = () => {
    // aggregate calories and macros from foundItems (fallback to 450 kcal if none found)
    const totalCalories =
      foundItems.reduce((s, it) => s + (Number(it.calories) || 0), 0) || 450;
    const totalProtein = foundItems.reduce(
      (s, it) => s + (Number(it.protein) || 0),
      0
    );
    const totalCarbs = foundItems.reduce(
      (s, it) => s + (Number(it.carbs) || 0),
      0
    );
    const totalFats = foundItems.reduce(
      (s, it) => s + (Number(it.fats) || 0),
      0
    );

    const newMeal = {
      id: Date.now(),
      name: foundItems.map((item) => item.name).join(", "),
      category: selectedCategory,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      photoUrl:
        uploadedPhotoUrl ||
        "https://placehold.co/100x100/A3BFD1/1C2031?text=Scanned",
    };

    onLogFood(newMeal);
    onClose();
  };

  // cleanup preview object URL when the modal unmounts or when a new file is chosen
  useEffect(() => {
    return () => {
      if (uploadedPhotoUrl) URL.revokeObjectURL(uploadedPhotoUrl);
    };
  }, [uploadedPhotoUrl]);

  const handleAmountChange = (id, newAmount) => {
    setFoundItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, amount: newAmount } : item
      )
    );
  };

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Pre-Workout",
    "Post-Workout",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-md sm:max-w-xl md:max-w-2xl rounded-2xl shadow-lg p-6 text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "start" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Add Food</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="-mr-2 text-gray-700 dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
              />

              <Button
                variant="secondary"
                size="lg"
                className="w-full text-base"
                onClick={onUploadClick}
              >
                <Camera className="w-5 h-5 mr-3" />
                Scan with Camera
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base"
                onClick={onUploadClick}
              >
                <ImageUp className="w-5 h-5 mr-3" />
                Upload from Gallery
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-base text-gray-600 dark:text-gray-300"
              >
                Or Enter Manually
              </Button>
            </div>
          </>
        )}

        {step === "uploading" && (
          <div className="flex flex-col items-center justify-center h-48">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
              Analyzing your meal...
            </p>
          </div>
        )}

        {step === "confirm" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Items</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="-mr-2 text-gray-700 dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <img
              src={
                uploadedPhotoUrl ||
                "https://placehold.co/400x200/A3BFD1/1C2031?text=Your+Uploaded+Photo"
              }
              alt="Uploaded meal"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {foundItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="flex-1 text-gray-800 dark:text-gray-200">
                    {item.name}
                  </span>
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) =>
                      handleAmountChange(item.id, e.target.value)
                    }
                    className="w-28 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-2">
                Assign to Meal
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Button size="lg" className="w-full text-base" onClick={handleLog}>
              Log Meal
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
