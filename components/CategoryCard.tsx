import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  taskCount: number;
  completedCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, taskCount, completedCount }) => {
  const percentage = taskCount === 0 ? 0 : Math.round((completedCount / taskCount) * 100);

  return (
    <div className="bg-app-dark rounded-3xl p-5 min-w-[160px] w-[45%] flex-shrink-0 shadow-lg flex flex-col justify-between h-32 mr-4 transition-transform hover:scale-105">
      <div>
        <div className="text-gray-400 text-xs font-medium mb-1">{taskCount} tasks</div>
        <div className="text-white text-xl font-bold tracking-wide">{category}</div>
      </div>
      
      <div className="w-full bg-app-input rounded-full h-1.5 mt-4 relative overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-app-pink to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CategoryCard;