const Progress = ({ value = 0, colorClass = "bg-indigo-500" }) => (
  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div
      className={`h-2 ${colorClass} rounded-full transition-all duration-500`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

export default Progress;
