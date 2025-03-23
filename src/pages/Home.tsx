import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import TaskColumn from '../components/Tasks/TaskColumn';
// import TaskDetail from '../components/Tasks/TaskDetail.tsx';
// import TaskEditForm from '../components/Tasks/TaskEditForm';
import { Task, TaskStatus, TaskPriority } from '../types/task';
// import { useAuth } from '../context/AuthContext';
// import { getTasks, updateTask } from '../services/taskService';
import Button from '../components/UI/Button';

const Home = () => {
  // const { authState } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // const tasksData = await getTasks();
        const tasksData : Task[] = [
          {
            id: "1",
            title: "Bug",
            description: "this is description",
            status: "TODO",
            priority: "LOW",
            start_date: "",
            end_date: "",
            owned_by: {
              id: "2",
              firstName: "Han",
              lastName: "Solo",
              email: "test@email"
            },
            createdAt: "",
            updatedAt: ""
          }
        ]
        setTasks(tasksData);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

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

  // Handle task update
  const handleTaskUpdate = async (
    taskId: string,
    data: { title: string; description: string; status: TaskStatus }
  ) => {
    // try {
    //   setIsTaskUpdating(true);
    //   const updatedTask = await updateTask(taskId, data);
      
    //   // Update tasks in state
    //   setTasks((prevTasks) =>
    //     prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    //   );
      
    //   // Close modal and update selected task
    //   setIsEditModalOpen(false);
    //   setSelectedTask(updatedTask);
    // } catch (err) {
    //   console.error('Failed to update task:', err);
    //   alert('Failed to update task. Please try again.');
    // } finally {
    //   setIsTaskUpdating(false);
    // }
  };

  // Handle drag and drop
  const handleDropTask = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Find the task
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate || taskToUpdate.status === newStatus) return;

      // Optimistically update UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update on server
      // await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      alert('Failed to move task. Please try again.');
      
      // Revert the optimistic update on failure
      setTasks((prevTasks) => [...prevTasks]);
    }
  };

  // Placeholder for creating a new task
  const handleCreateTask = () => {
    setIsCreatingTask(true);
    // In a real app, this would open a modal with a form
    alert('Task creation would be implemented in a real application');
    setIsCreatingTask(false);
  };

  return (
    <MainLayout requireAuth>
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Button onClick={handleCreateTask} disabled={isCreatingTask}>
          {isCreatingTask ? 'Creating...' : 'Create New Task'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
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
      {/* <TaskDetail
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditClick}
        currentUserId={authState.user?.id}
      /> */}

      {/* Task edit modal */}
      {/* <TaskEditForm
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleTaskUpdate}
        isLoading={isTaskUpdating}
      /> */}
    </MainLayout>
  );
};

export default Home;