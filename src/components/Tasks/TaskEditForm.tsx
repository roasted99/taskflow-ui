import { useEffect, useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { User } from '../../types/auth';
import { useAuth } from '../../context/useAuth';

interface TaskEditFormProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (taskIid: string) => void;
  onSave: (taskId: string, data: { title: string; description: string; status: TaskStatus, priority: TaskPriority, start_date: Date | string, end_date: Date | string, assigned_to_id: string }) => void;
  isLoading: boolean;
  users: User[];
}

const TaskEditForm = ({
  task,
  isOpen,
  onClose,
  onSave,
  isLoading,
  users,
  onDelete
}: TaskEditFormProps) => { 
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as TaskPriority,
    start_date: '',
    end_date: '',
    assigned_to_id: ''
  });

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        start_date: task.start_date,
        end_date: task.end_date,
        assigned_to_id: task.assigned_to?.id || ''
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onSave(task.id, formData);
    }
  };

  if (!task) return null;
  const isOwner = authState.user?.id === task.owned_by.id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-smgg font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="assignedTo"
              className='block text-smgg font-medium text-gray-700 mb-1'
            >
              Assigned to
            </label>
            <select
              value={formData.assigned_to_id}
              onChange={handleChange}
              name='assigned_to_id'
              className="w-full px-3 py-2 border rounded p-2 flex-grow"
            >
              <option value="">Not assigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between pt-4">
            {isOwner && (
            <div className="flex justify-start">
              <Button
                type="button"
                variant="danger" 
                onClick={() => onDelete(task.id)} 
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default TaskEditForm;