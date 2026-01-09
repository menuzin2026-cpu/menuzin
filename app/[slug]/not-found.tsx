export default function NotFound() {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden flex items-center justify-center bg-black">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">Restaurant not found</p>
        <p className="text-gray-500">
          This restaurant may have been deleted or the URL is incorrect.
        </p>
      </div>
    </div>
  )
}

