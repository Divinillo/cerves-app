import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function Rating({ value, onChange, size = 'md', readonly = false }: RatingProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  const iconSize = sizeMap[size];

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`transition-all duration-200 ${
            readonly ? 'cursor-default' : 'hover:scale-120 cursor-pointer active:scale-95'
          }`}
        >
          <Star
            size={iconSize}
            className={`transition-all duration-200 ${
              star <= value
                ? 'fill-amber-500 text-amber-500 filter drop-shadow-lg'
                : 'text-slate-300 hover:text-slate-400'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
