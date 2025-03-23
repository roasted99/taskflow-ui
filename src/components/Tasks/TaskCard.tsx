import { useState } from 'react';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
}

const TaskCard = ({ task, onClick, onDragStart }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(task)}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        transform: isHovered ? 'translateY(-2px)' : 'none',
        opacity: isHovered ? 0.95 : 1
      }}
    >
      <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3">
        {truncateText(task.description, 100)}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        {/* <span>Updated: {formatDate(task.updatedAt)}</span> */}
        <span
          className={`px-2 py-1 rounded-full ${
            task.status === 'TODO'
              ? 'bg-gray-200 text-gray-700'
              : task.status === 'IN_PROGRESS'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {task.status === 'TODO'
            ? 'To Do'
            : task.status === 'IN_PROGRESS'
            ? 'In Progress'
            : 'Done'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;