export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
