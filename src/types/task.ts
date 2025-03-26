import { User } from "./auth";

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  owned_by: User;
  assigned_to?: User;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: Date | string;
  end_date: Date | string;
  assigned_to_id: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string | Date;
  end_date?: string | Date;
  assigned_to_id?: string;
}