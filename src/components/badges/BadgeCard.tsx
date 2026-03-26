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
      className={`p-4 rounded-lg text-center transition ${
        isEarned
          ? 'bg-amber-100 border-2 border-amber-500'
          : 'bg-slate-100 border-2 border-slate-300 opacity-60'
      }`}
    >
      <div className="text-4xl mb-2">{badge.icon}</div>
      <h3 className="font-bold text-slate-800">{badge.name}</h3>

      {badge.description && (
        <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
      )}

      {!isEarned && badge.progress !== undefined && badge.maxProgress && (
        <div className="mt-2">
          <div className="w-full bg-slate-300 rounded-full h-2 mb-1">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            {badge.progress}/{badge.maxProgress}
          </p>
        </div>
      )}

      {isEarned && (
        <p className="text-xs font-semibold text-amber-600 mt-2">
          Conseguido
        </p>
      )}
    </div>
  );
}
