import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Task, Category } from './types';
import CategoryCard from './components/CategoryCard';
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';

const STORAGE_KEY = 'neon-tasker-data';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Wake up by 6am', category: Category.Personal, completed: true, createdAt: Date.now() },
  { id: '2', title: 'Check emails', category: Category.Work, completed: false, createdAt: Date.now() },
  { id: '3', title: 'Lunch with team', category: Category.Business, completed: false, createdAt: Date.now() },
  { id: '4', title: 'Meditation', category: Category.Health, completed: false, createdAt: Date.now() },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addTask = (title: string, category: Category, id?: string) => {
    if (id) {
      // Edit existing
      setTasks(prev => prev.map(t => t.id === id ? { ...t, title, category } : t));
    } else {
      // Create new
      const newTask: Task = {
        id: generateId(),
        title,
        category,
        completed: false,
        createdAt: Date.now()
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; completed: number }> = {};
    
    // Initialize all categories with 0
    Object.values(Category).forEach(cat => {
      stats[cat] = { count: 0, completed: 0 };
    });

    // Count tasks
    tasks.forEach(task => {
      if (stats[task.category]) {
        stats[task.category].count++;
        if (task.completed) stats[task.category].completed++;
      }
    });

    return stats;
  }, [tasks]);

  // Sort tasks: Incomplete first, then by creation date
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return b.createdAt - a.createdAt;
      return a.completed ? 1 : -1;
    });
  }, [tasks]);

  return (
    <div className="min-h-screen bg-app-bg text-gray-800 font-sans flex items-center justify-center p-0 sm:p-4 md:p-8">
      
      {/* Main Container - Mobile First Design */}
      <div className="w-full max-w-md h-screen sm:h-[800px] bg-app-bg sm:bg-[#96ADFC] sm:rounded-[40px] relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Background Decorative Circle (Optional aesthetic touch) */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Section */}
        <div className="pt-12 px-8 pb-4">
          <h1 className="text-white text-3xl font-bold tracking-widest mb-8">MY TASKS</h1>
          
          <div className="mb-2 text-xs font-bold text-gray-100/60 tracking-wider uppercase">Categories</div>
          
          {/* Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto pb-6 -mx-8 px-8 hide-scrollbar snap-x">
            {Object.values(Category).map(cat => (
              <CategoryCard 
                key={cat}
                category={cat} 
                taskCount={categoryStats[cat].count}
                completedCount={categoryStats[cat].completed}
              />
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex-1 px-8 pb-24 overflow-y-auto hide-scrollbar">
          <div className="mb-4 text-xs font-bold text-gray-100/60 tracking-wider uppercase">Today's Tasks</div>
          
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center text-white/50 mt-10">
                <p>No tasks yet.</p>
                <p className="text-sm">Tap + to add one!</p>
              </div>
            ) : (
              sortedTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask}
                  onEdit={openEditModal}
                />
              ))
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-8 right-8">
          <button 
            onClick={openAddModal}
            className="w-14 h-14 bg-app-pink rounded-full flex items-center justify-center text-white shadow-lg shadow-app-pink/40 hover:scale-110 hover:rotate-90 transition-all duration-300"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Add/Edit Task Modal */}
        <AddTaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={addTask}
          editingTask={editingTask}
        />

      </div>
    </div>
  );
}