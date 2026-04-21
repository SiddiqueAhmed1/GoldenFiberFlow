export default function LoadingSpinner({
  border = "primary",
  color = "text-muted-foreground",
  text = "Loading...",
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center space-y-3">
        <div
          className={`w-8 h-8 border-2 border-${border} border-t-transparent rounded-full animate-spin mx-auto`}
        />
        <p className={`text-sm text-${color} `}>{text}</p>
      </div>
    </div>
  );
}
