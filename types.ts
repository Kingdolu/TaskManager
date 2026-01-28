export enum Category {
  Business = 'Business',
  School = 'School',
  Personal = 'Personal',
  Work = 'Work',
  Health = 'Health'
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}
