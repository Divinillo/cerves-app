interface ProfileStatsProps {
  beerCount: number;
  barCount: number;
  followersCount: number;
  followingCount: number;
}

export default function ProfileStats({
  beerCount,
  barCount,
  followersCount,
  followingCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-600">{beerCount}</p>
        <p className="text-sm text-slate-600">Cervezas</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-600">{barCount}</p>
        <p className="text-sm text-slate-600">Bares</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-600">{followersCount}</p>
        <p className="text-sm text-slate-600">Seguidores</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-600">{followingCount}</p>
        <p className="text-sm text-slate-600">Siguiendo</p>
      </div>
    </div>
  );
}
