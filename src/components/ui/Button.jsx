export default function Button({ children, className = "", loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition 
        ${props.disabled || loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}