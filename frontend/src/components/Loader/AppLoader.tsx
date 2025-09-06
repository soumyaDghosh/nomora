const AppLoader = () => {
  return (
    <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default AppLoader;