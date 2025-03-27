import { Task } from '../../types/task';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import { FaGripLines } from "react-icons/fa6";
interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  currentUserId: string | undefined;
}

const TaskDetail = ({
  task,
  isOpen,
  onClose,
  onEdit,
  currentUserId,
}: TaskDetailProps) => {
  if (!task) return null;

  // Check if the current user is the owner of the task
  const isOwnerOrAssigned = currentUserId === task.owned_by.id || currentUserId === task.assigned_to?.id;

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (task.status) {
      case 'TODO':
        return 'bg-gray-200 text-gray-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'DONE':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // Priority icon mapping
  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'LOW':
        return <FaGripLines />
      case 'MEDIUM':
        return <RiArrowUpSLine color='orange' />; // Single up arrow for medium
      case 'HIGH':
        return <RiArrowUpDoubleLine color='red' />; // Dash for low priority
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="space-y-4">
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
            {getPriorityIcon(task.priority)}
          </span>

          {/* Status */}
          <span
            className={`px-2 py-1 rounded-full ${getStatusBadgeClass()}`}
          >
            {task.status === 'TODO'
              ? 'TO DO'
              : task.status === 'IN_PROGRESS'
                ? 'IN PROGRESS'
                : 'DONE'}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
          {task.description}
        </div>

        <div className="text-sm text-gray-600">
          <p>Start Date: {task.start_date || "Not set"}</p>
          <p>End Date: {task.end_date || "Not set"}</p>
        </div>

        <div className="text-sm text-gray-600">
          <p>Assigned to: {task.assigned_to?.first_name ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}` : 'Not assigned'} </p>
          <p>Owned by: {task.owned_by?.first_name ? `${task.owned_by.first_name} ${task.owned_by.last_name}` : 'Not assigned'} </p>
        </div>

        <div className="flex justify-end items-center pt-4 border-t">
          <div className="ml-auto">
            <Button onClick={onClose} variant="secondary" className="mr-2">
              Close
            </Button>
            {isOwnerOrAssigned && (
              <Button onClick={onEdit}>Edit Task</Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetail;