const Card = ({ className = "", children }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${className}`}
  >
    {children}
  </div>
);

export default Card;
