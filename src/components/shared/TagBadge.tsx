import { X } from 'lucide-react';

interface TagBadgeProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

// Generate a consistent color based on label hash
const getColorFromLabel = (label: string) => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-cyan-100 text-cyan-800',
    'bg-teal-100 text-teal-800',
  ];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function TagBadge({ label, onRemove, onClick, variant = 'primary' }: TagBadgeProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all';
  const variantClasses = {
    primary: getColorFromLabel(label) + ' hover:shadow-md',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-md',
  };

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
