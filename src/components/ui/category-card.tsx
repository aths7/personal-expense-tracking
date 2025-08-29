import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Shield, User } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  isCustom: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function CategoryCard({
  id,
  name,
  color = '#D5DBDB',
  icon,
  isCustom,
  onEdit,
  onDelete,
  showActions = true
}: CategoryCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: color }}
          >
            {icon?.slice(0, 2).toUpperCase() || 'UN'}
          </div>
          <span className="font-medium">{name}</span>
        </div>
        <Badge variant={isCustom ? "secondary" : "outline"}>
          {isCustom ? (
            <>
              <User className="h-3 w-3 mr-1" />
              Custom
            </>
          ) : (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Default
            </>
          )}
        </Badge>
      </div>

      {showActions && isCustom && (onEdit || onDelete) && (
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}