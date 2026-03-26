interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    icon: string;
    description?: string;
    earned?: boolean;
    progress?: number;
    maxProgress?: number;
  };
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const isEarned = badge.earned ?? false;
  const progressPercent = badge.progress
    ? (badge.progress / (badge.maxProgress || 100)) * 100
    : 0;

  return (
    <div
      className={`rounded-2xl p-6 text-center transition-all duration-300 min-w-[160px] ${
        isEarned
          ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-500 shadow-lg hover:shadow-2xl hover:scale-105'
          : 'bg-slate-100 border-2 border-slate-300 opacity-60 shadow-md'
      }`}
    >
      <div className={`text-5xl mb-3 ${isEarned ? 'drop-shadow-lg' : 'opacity-50'}`}>
        {badge.icon}
      </div>
      <h3 className={`font-bold mb-1 ${isEarned ? 'text-slate-800' : 'text-slate-600'}`}>
        {badge.name}
      </h3>

      {badge.description && (
        <p className={`text-xs mt-1 ${isEarned ? 'text-slate-600' : 'text-slate-500'}`}>
          {badge.description}
        </p>
      )}

      {!isEarned && badge.progress !== undefined && badge.maxProgress && (
        <div className="mt-3">
          <div className="w-full bg-slate-300 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-slate-600">
            {badge.progress}/{badge.maxProgress}
          </p>
        </div>
      )}

      {isEarned && (
        <div className="mt-3 inline-flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          ✓ Conseguido
        </div>
      )}
    </div>
  );
}
