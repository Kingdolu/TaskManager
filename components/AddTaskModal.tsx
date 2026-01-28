import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Category, Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, category: Category, id?: string) => void;
  editingTask?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, editingTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.Business);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
    } else {
      setTitle('');
      setCategory(Category.Business);
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, category, editingTask?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-app-dark/90 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/10 transform transition-all scale-100 opacity-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-center text-white text-xl font-bold mb-8 tracking-widest">
          {editingTask ? 'EDIT TASK' : 'ADD A TASK'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm ml-1">Task</label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to do?"
                className="w-full bg-app-input text-white px-6 py-4 rounded-xl outline-none border border-transparent focus:border-app-pink/50 transition-all placeholder-gray-400 font-medium"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-gray-400 text-sm ml-1">Category</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-app-input text-white px-6 py-4 rounded-xl outline-none flex items-center justify-between group hover:bg-app-input/80 transition-colors"
            >
              <span className="font-medium">{category}</span>
              <ChevronDown 
                size={20} 
                className={`text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden shadow-xl z-50 border border-white/5">
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 text-white transition-colors hover:bg-app-pink/20
                      ${category === cat ? 'bg-app-pink/10 text-app-pink font-semibold' : ''}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-min mx-auto block bg-app-pink text-white px-12 py-3 rounded-full font-bold shadow-lg shadow-app-pink/30 hover:shadow-app-pink/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {editingTask ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;