import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/tasks`, {
        params: {
          dueDate: selectedDate.toISOString().split("T")[0],
        },
      });
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "in-progress":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 pr-4">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="w-full"
        />
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          Tasks for {selectedDate.toDateString()}
        </h2>
        {tasks.length === 0 ? (
          <p>No tasks due on this date.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="mb-4 p-4 border rounded">
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                <span
                  className={`inline-block px-2 py-1 rounded ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
