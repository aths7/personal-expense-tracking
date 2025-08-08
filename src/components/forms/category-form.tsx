'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/utils/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CHART_COLORS } from '@/constants';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitText?: string;
}

const AVAILABLE_ICONS = [
  'UtensilsCrossed',
  'Car',
  'Gamepad2',
  'Receipt',
  'ShoppingBag',
  'Heart',
  'GraduationCap',
  'Plane',
  'Apple',
  'Home',
  'Coffee',
  'Fuel',
  'Bus',
  'ShoppingCart',
  'Shirt',
  'Phone',
  'Wifi',
  'Zap',
  'MoreHorizontal',
];

export function CategoryForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitText = 'Save Category',
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name || '',
      color: defaultValues?.color || CHART_COLORS[0],
      icon: defaultValues?.icon || AVAILABLE_ICONS[0],
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Groceries, Gas, Entertainment"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Color *</Label>
        <div className="flex flex-wrap gap-2">
          {CHART_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color 
                  ? 'border-gray-900 dark:border-white scale-110' 
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
              title={color}
            />
          ))}
        </div>
        {errors.color && (
          <p className="text-sm text-red-500">{errors.color.message}</p>
        )}
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label htmlFor="icon">Icon *</Label>
        <Select
          value={selectedIcon}
          onValueChange={(value) => setValue('icon', value)}
        >
          <SelectTrigger className={errors.icon ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_ICONS.map((icon) => (
              <SelectItem key={icon} value={icon}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {icon.slice(0, 2).toUpperCase()}
                  </div>
                  <span>{icon.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.icon && (
          <p className="text-sm text-red-500">{errors.icon.message}</p>
        )}
      </div>

      {/* Preview */}
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h4 className="text-sm font-medium mb-2">Preview</h4>
        <div className="flex items-center space-x-3">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: selectedColor }}
          >
            {selectedIcon.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-medium">{watch('name') || 'Category Name'}</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitText}
      </Button>
    </form>
  );
}