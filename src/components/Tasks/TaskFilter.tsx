import { User } from '../../types/auth';

interface TaskFilterProps {
  users: User[];
  onFilterChange: (key: string, value: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ users, onFilterChange }) => {

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-md">Filter Tasks by:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            // value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full border rounded p-2"
            aria-label='Status'
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            // value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Assigned To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <select
            // value={filters.assigned_to_id}
            onChange={(e) => onFilterChange('assigned_to_id', e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            // value={filters.startDate}
            onChange={(e) => onFilterChange('start_date', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            // value={filters.endDate}
            onChange={(e) => onFilterChange('end_date', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;