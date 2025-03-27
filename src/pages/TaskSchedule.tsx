import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { Task } from '../types/task';
import { getTasks } from '../services/taskService';
import MainLayout from '../components/Layout/MainLayout';

const TaskSchedule = () => {
  const { authState } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonthDetails = (date: Date) => {
    const d = new Date(date);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    return {
      monthStart: monthStart.toISOString().split('T')[0],
      monthEnd: monthEnd.toISOString().split('T')[0]
    };
  };

  // Fetch tasks for a specific month
  const fetchTasksForMonth = async (monthStart: string, monthEnd: string) => {
    try {
      const filters = { date_range: `${monthStart},${monthEnd}`, assigned_to_id: authState.user?.id }
      const data = await getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Month navigation
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    const { monthStart, monthEnd } = getMonthDetails(currentMonth);
    fetchTasksForMonth(monthStart, monthEnd);
  }, [currentMonth]);

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const grid = [];
    const startingDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      grid.push(<div key={`empty-${i}`} className="border p-2 h-20 bg-gray-50"></div>);
    }

    // Generate days with tasks
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

      // Find tasks for this date
      const dayTasks = tasks.filter(task => {
        const startDate = new Date(task.start_date);
        const endDate = new Date(task.end_date);
        return currentDate >= startDate && currentDate <= endDate;
      });

      grid.push(
        <div
          key={day}
          className="border p-2 h-20 relative"
        >
          <div className="text-sm font-bold mb-1">{day}</div>
          {dayTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1 truncate"
              title={task.title}
            >
              {task.title}
            </div>
          ))}
        </div>
      );
    }

    return grid;
  };

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Task Schedule for {`${authState.user?.first_name} ${authState.user?.last_name}`}
        </h1>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
          >
            Previous
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold bg-gray-100 p-2">{day}</div>
          ))}
          {generateCalendarGrid()}
        </div>
      </div>

    </MainLayout>
  );
};


export default TaskSchedule;