import React from 'react';
import { Task } from '../types';
import { Trash2, Edit2, Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className="bg-app-dark rounded-2xl p-4 mb-3 flex items-center justify-between shadow-md group animate-fade-in">
      <div className="flex items-center gap-4 overflow-hidden">
        <button 
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
            ${task.completed 
              ? 'bg-app-pink border-app-pink' 
              : 'border-app-pink bg-transparent hover:bg-app-pink/20'
            }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>
        
        <span className={`text-white font-medium truncate transition-all ${task.completed ? 'opacity-50 line-through' : ''}`}>
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-3 pl-2 flex-shrink-0">
        <button 
          onClick={() => onEdit(task)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;