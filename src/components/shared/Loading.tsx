interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loading({ fullScreen = false, text }: LoadingProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-3 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-amber-500 border-r-amber-500 animate-spin"></div>
        </div>
      </div>
      {text && <p className="text-slate-600 font-semibold text-lg">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
