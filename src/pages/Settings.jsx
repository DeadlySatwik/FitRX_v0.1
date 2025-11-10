import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import Button from "../components/Button";
import Card from "../components/Card";
import { ChevronLeft, ChevronRight, Download, LogOut } from "lucide-react";

const ToggleSwitch = ({ defaultChecked = false }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      defaultChecked={defaultChecked}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600" />
  </label>
);

const SettingRowItem = ({ label, description, children }) => (
  <div className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 -mx-4 px-4">
    <div>
      <p className="font-medium text-sm text-gray-900 dark:text-white">
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
    <div className="ml-4 flex-shrink-0">{children}</div>
  </div>
);

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const signout = async () => {
    try {
      setloading(true);
      await supabase.auth.signOut();
    } catch {
      console.log("Error Logging out...");
    } finally {
      setloading(false);

      navigate("/login");
    }
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
          Settings
        </h2>
      </header>
      <div className="space-y-4">
        <Card className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <h3 className="text-lg font-semibold pb-2 px-4 -mx-4">
            Notifications
          </h3>
          <SettingRowItem
            label="Push Notifications"
            description="Receive updates on your device"
          >
            <ToggleSwitch />
          </SettingRowItem>
          <SettingRowItem
            label="Workout Reminders"
            description="Daily workout alerts"
          >
            <ToggleSwitch defaultChecked />
          </SettingRowItem>
          <SettingRowItem
            label="Achievement Alerts"
            description="Celebrate your milestones"
          >
            <ToggleSwitch defaultChecked />
          </SettingRowItem>
        </Card>
        <Card className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <h3 className="text-lg font-semibold pb-2 px-4 -mx-4">Preferences</h3>
          <SettingRowItem label="Weight Unit">
            <span className="font-medium">Kilograms (kg)</span>
          </SettingRowItem>
          <SettingRowItem
            label="Default Rest Timer"
            description="Set time between sets"
          >
            <span className="font-medium">90s</span>
          </SettingRowItem>
        </Card>
        <Card className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <h3 className="text-lg font-semibold pb-2 px-4 -mx-4">Account</h3>
          <SettingRowItem label="Change Password">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </SettingRowItem>
          <SettingRowItem label="Download My Data">
            <Download className="w-5 h-5 text-gray-400" />
          </SettingRowItem>
          <SettingRowItem label="Privacy Policy">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </SettingRowItem>
          <SettingRowItem label="Terms of Service">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </SettingRowItem>
          <div className="pt-3">
            <Button
              disabled={loading}
              variant="destructive"
              className="w-full bg-red-500 dark:bg-red-600"
              onClick={signout}
            >
              <LogOut className="w-4 h-4 mr-2" />{" "}
              {loading ? "Loading" : "Sign Out"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
