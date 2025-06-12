interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ isVisible, message = "Loading weather data..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl border border-blue-200">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-[hsl(var(--professional-blue))]"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-[hsl(var(--professional-teal))] opacity-20"></div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-2">🌤️</div>
          <span className="text-[hsl(var(--storm-gray))] font-semibold text-lg">{message}</span>
          <p className="text-blue-600 text-sm mt-1">Loading weather data...</p>
        </div>
      </div>
    </div>
  );
}
