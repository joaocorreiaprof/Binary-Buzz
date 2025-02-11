const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-semibold">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
