import { useState } from 'react';
import { Task, } from '../../types/task';
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { FaGripLines } from "react-icons/fa6";

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

    // Priority icon mapping
  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'LOW':
        return <FaGripLines />
      case 'MEDIUM':
        return <RiArrowUpSLine color='orange'/>; 
      case 'HIGH':
        return <RiArrowUpDoubleLine color='red'/>; 
    }
  };

    // Priority color mapping
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Status color mapping
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-200 text-gray-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'DONE':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return(
    <div
      className="bg-white p-4 rounded-lg shadow mb-3 cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(task)}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'none',
        opacity: isHovered ? 0.95 : 1,
      }}
    >
      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-800 mb-2">
        {task?.title || 'Untitled Task'}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3">
        {task.description ? truncateText(task.description, 100) : ''}
      </p>

      {/* Priority and Status */}
      <div className="flex justify-between items-center text-xs">
        {/* Priority */}
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
        >
        {task.priority === 'LOW'
          ? 'LOW'
          : task.priority === 'MEDIUM'
          ? 'MEDIUM'
          : 'HIGH'}
          {getPriorityIcon(task?.priority)}
        </span>

        {/* Status */}
        <span
          className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
          >
          {task.status === 'TODO'
            ? 'TO DO'
            : task.status === 'IN_PROGRESS'
            ? 'IN PROGRESS'
            : 'DONE'}
        </span>
      </div>

      <div className='text-gray-600 text-sm mb-3 mt-2'>
        <p>Assigned to: {task.assigned_to?.first_name ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : 'Not assigned'} </p>
        <p>Owned by: {task.owned_by?.first_name ? `${task.owned_by.first_name} ${task.owned_by.last_name}` : 'Not assigned'} </p>
      </div>

    </div>
  );
};

export default TaskCard;