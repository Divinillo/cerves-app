import { X } from 'lucide-react';

interface TagBadgeProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function TagBadge({ label, onRemove, onClick, variant = 'primary' }: TagBadgeProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition';
  const variantClasses = {
    primary: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
  };

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-current"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
