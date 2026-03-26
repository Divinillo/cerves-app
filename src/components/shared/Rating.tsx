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
    lg: 32,
  };

  const iconSize = sizeMap[size];

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`transition ${readonly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
        >
          <Star
            size={iconSize}
            className={`${
              star <= value
                ? 'fill-amber-500 text-amber-500'
                : 'text-slate-300'
            } transition`}
          />
        </button>
      ))}
    </div>
  );
}
