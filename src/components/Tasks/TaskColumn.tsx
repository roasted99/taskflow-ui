import { useState } from 'react';
import { Task, TaskStatus } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskColumn = ({
  title,
  status,
  tasks,
  onTaskClick,
  onDropTask,
}: TaskColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDropTask(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  // Background color based on status
  const getBackgroundColor = () => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-50';
      case 'IN_PROGRESS':
        return 'bg-blue-50';
      case 'DONE':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div
      className={`flex-1 min-w-0 p-4 rounded-lg ${getBackgroundColor()} ${
        isDragOver ? 'ring-2 ring-blue-400' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;