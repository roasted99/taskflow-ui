import { useEffect, useRef, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import TaskColumn from '../components/Tasks/TaskColumn';
import TaskDetail from '../components/Tasks/TaskDetail.tsx';
import TaskEditForm from '../components/Tasks/TaskEditForm';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { useAuth } from '../context/useAuth.ts';
import { getTasks, updateTask, createTask, deleteTask } from '../services/taskService';
import Button from '../components/UI/Button';
import TaskCreateForm from '../components/Tasks/TaskCreateForm.tsx';
import { User } from '../types/auth.ts';
import { getUsers } from '../services/authService.ts';
import TaskFilter from '../components/Tasks/TaskFilter.tsx';

const Home = () => {
  const { authState } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noti, setNoti] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);
  const [isTaskCreating, setIsTaskCreating] = useState(false);
  const [filters, setFilters] = useState<{
    status?: TaskStatus | string;
    priority?: TaskPriority | string;
    owned_by_id?: string;
    assigned_to?: string;
    start_date?: string;
    end_date?: string;
  }>({});
  const previousFilter = useRef<{
    status?: TaskStatus | string;
    priority?: TaskPriority | string;
    owned_by_id?: string;
    assigned_to?: string;
    start_date?: string;
    end_date?: string;
  }>(null);

  const fetchTasks = async (filters?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const filterParam: Record<string, any> = {};
      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
          filterParam[key] = filters[key];

        }
      }
      if (filterParam.hasOwnProperty('start_date') && filterParam.hasOwnProperty('end_date')) {
        filterParam['date_range'] = filterParam['start_date'] + ',' + filterParam['end_date']
        delete filterParam['start_date'];
        delete filterParam['end_date'];
      }

      const tasksData = await getTasks(filterParam);

      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error(err);
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch users
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers(); // You'll need to create this service method
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };
  // Fetch tasks on component mount
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // Filter tasks by status
  const filterTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // Handle task click to show details
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (filterKey: string, filterValue: string) => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      [filterKey]: filterValue
    }))
  };

  // Handle task update
  const handleTaskUpdate = async (
    taskId: string,
    data: { title: string; description: string; status: TaskStatus, priority: TaskPriority, start_date: Date | string, end_date: Date | string, assigned_to_id: string }
  ) => {
    try {
      setIsTaskUpdating(true);
      const updatedTask = await updateTask(taskId, data);

      // Update tasks 
      updateTask(taskId, data).then((res) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? res : task))
      );
      setIsEditModalOpen(false);
      setSelectedTask(updatedTask);
      setNoti("Task has updated successfully")
      fetchTasks()
        
      })
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsTaskUpdating(false);
    }
  };

  const handleTaskCreate = async (
    data: { title: string; description: string; status: TaskStatus, priority: TaskPriority, start_date: Date | string, end_date: Date | string, assigned_to_id: string }
  ) => {
    try {
      setIsTaskCreating(true);
      // Close modal and update selected task
      setNoti("Task has created successfully")
      createTask(data).then(() => {
        setIsCreateModalOpen(false);
        setNoti("Task has successfully deleted")
        fetchTasks()
      })
    } catch (err) {
      console.error('Failed to create task:', err);
      setError("Failed to create task. Please try again")
    } finally {
      setIsTaskCreating(false);
    }
  };

  // Handle drag and drop
  const handleDropTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Find the task
      const taskToUpdate = tasks.find((task) => task.id === taskId);

      if (!taskToUpdate || taskToUpdate.status === newStatus) return;

      if (taskToUpdate?.assigned_to?.id != authState.user?.id && taskToUpdate?.owned_by.id != authState.user?.id) {
        setError("You need to be assigned to or owned the task to update")
        return
      }

      // Optimistically update UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update on server
      updateTask(taskId, { status: newStatus }).then(() => {
        setNoti("Task status has successfully updated");
        fetchTasks()
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError('Failed to move task. Please try again.');
      // Revert the optimistic update on failure
      setTasks((prevTasks) => [...prevTasks]);
    }
  };

  // Placeholder for creating a new task
  const handleCreateTask = () => {
    setIsCreateModalOpen(true)
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      setIsEditModalOpen(false);
      deleteTask(taskId).then(() => {
        setNoti("Task has successfully deleted")
        fetchTasks()
      })
    } catch (error) {
      console.error(error)
      setError("Cannot delete task. Please try again.")
    }
  }

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(previousFilter.current)) {
      fetchTasks(filters);
      previousFilter.current = { ...filters };
    }
  }, [filters]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError('');
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
    if (noti) {
      const timeoutId = setTimeout(() => {
        setNoti('');
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [noti, error]);


  return (
    <MainLayout requireAuth>
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <Button onClick={handleCreateTask}>
          Create New Task
        </Button>
      </div>
      <TaskFilter
        users={users}
        onFilterChange={handleFilterChange}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {noti && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {noti}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn
            title="To Do"
            status="TODO"
            tasks={filterTasksByStatus('TODO')}
            onTaskClick={handleTaskClick}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="In Progress"
            status="IN_PROGRESS"
            tasks={filterTasksByStatus('IN_PROGRESS')}
            onTaskClick={handleTaskClick}
            onDropTask={handleDropTask}
          />
          <TaskColumn
            title="Done"
            status="DONE"
            tasks={filterTasksByStatus('DONE')}
            onTaskClick={handleTaskClick}
            onDropTask={handleDropTask}
          />
        </div>
      )}

      {/* Task detail modal */}
      <TaskDetail
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditClick}
        currentUserId={authState.user?.id}
      />

      {/* Task edit modal */}
      <TaskEditForm
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleTaskUpdate}
        isLoading={isTaskUpdating}
        users={users}
        onDelete={handleTaskDelete}
      />

      <TaskCreateForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleTaskCreate}
        isLoading={isTaskCreating}
        users={users}
      />
    </MainLayout>
  );
};

export default Home;