export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
        <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been deleted.</p>
        <a
          href="/trips"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Back to My Trips
        </a>
      </div>
    </div>
  );
}
