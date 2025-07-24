'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Palette } from 'lucide-react';
import { CategoryConfig, Category, PRESET_COLORS } from '@/types/Category';
import CategoryBadge from './CategoryBadge';

interface CategoryManagerProps {
  categories: CategoryConfig;
  onUpdateCategories: (categories: CategoryConfig) => void;
  onClose: () => void;
}

export default function CategoryManager({ 
  categories, 
  onUpdateCategories, 
  onClose 
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState({ 
    type: 'income' as 'income' | 'expense', 
    value: '', 
    color: PRESET_COLORS[0] 
  });
  const [editingCategory, setEditingCategory] = useState<{ 
    type: 'income' | 'expense'; 
    index: number; 
    value: string; 
    color: string;
  } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.value.trim() && !categories[newCategory.type].some(cat => cat.name === newCategory.value.trim())) {
      const updatedCategories = {
        ...categories,
        [newCategory.type]: [...categories[newCategory.type], {
          name: newCategory.value.trim(),
          color: newCategory.color,
          type: newCategory.type
        }]
      };
      onUpdateCategories(updatedCategories);
      setNewCategory({ type: 'income', value: '', color: PRESET_COLORS[0] });
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.value.trim()) {
      const updatedCategories = {
        ...categories,
        [editingCategory.type]: categories[editingCategory.type].map((cat, index) =>
          index === editingCategory.index 
            ? { ...cat, name: editingCategory.value.trim(), color: editingCategory.color }
            : cat
        )
      };
      onUpdateCategories(updatedCategories);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (type: 'income' | 'expense', index: number) => {
    const updatedCategories = {
      ...categories,
      [type]: categories[type].filter((_, i) => i !== index)
    };
    onUpdateCategories(updatedCategories);
  };

  const startEditing = (type: 'income' | 'expense', index: number, category: Category) => {
    setEditingCategory({ 
      type, 
      index, 
      value: category.name, 
      color: category.color 
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const renderCategoryList = (type: 'income' | 'expense', title: string, dotColor: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dotColor }}></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories[type].map((category, index) => (
          <div key={`${type}-${index}`} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            {editingCategory?.type === type && editingCategory.index === index ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingCategory.value}
                  onChange={(e) => setEditingCategory(prev => prev ? { ...prev, value: e.target.value } : null)}
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleEditCategory()}
                />
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: editingCategory.color }}
                >
                  <Palette size={12} className="text-white" />
                </button>
                {showColorPicker && (
                  <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-lg grid grid-cols-6 gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setEditingCategory(prev => prev ? { ...prev, color } : null);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={handleEditCategory}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <CategoryBadge category={category} />
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(type, index, category)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(type, index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add New Category */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add New Category
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="text"
                  value={newCategory.value}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: newCategory.color }}
                >
                  <Palette size={16} className="text-white" />
                </button>
              </div>
              
              {showColorPicker && (
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Choose a color:</p>
                  <div className="grid grid-cols-8 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setNewCategory(prev => ({ ...prev, color }));
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.value.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Add
                </button>
                {newCategory.value && (
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Preview:</span>
                    <CategoryBadge category={{
                      name: newCategory.value,
                      color: newCategory.color,
                      type: newCategory.type
                    }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Income Categories */}
          {renderCategoryList('income', 'Income Categories', '#10B981')}

          {/* Expense Categories */}
          {renderCategoryList('expense', 'Expense Categories', '#EF4444')}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 