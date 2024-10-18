import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

// Helper function to remove empty fields from an object
const removeEmptyFields = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ""));
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    dueDate: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchTasks();
      fetchCategories();
    }
  }, [currentPage, filters, isAuthenticated, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getTasks({
        page: currentPage,
        limit: 10,
        ...removeEmptyFields(filters), // Remove empty filters
      });
      setTasks(response.data.data.tasks);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await apiService.createTask(removeEmptyFields(newTask)); // Remove empty fields
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
        category: "",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateTask(
        editingTask._id,
        removeEmptyFields(editingTask)
      ); // Remove empty fields
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Tasks</h2>
      <form
        onSubmit={createTask}
        className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="p-2 border rounded"
          required
        />
        <div>
          <label htmlFor="dueDate" className="block mb-1 text-sm font-semibold">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="p-2 border rounded"
          />
        </div>
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded col-span-1 md:col-span-2 lg:col-span-1"
        >
          Add Task
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Due Date Filter with Label */}
          <div>
            <label
              htmlFor="filterDueDate"
              className="block mb-1 text-sm font-semibold"
            >
              Due Date
            </label>
            <input
              id="filterDueDate"
              type="date"
              value={filters.dueDate}
              onChange={(e) =>
                setFilters({ ...filters, dueDate: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setFilters({ category: "", status: "", dueDate: "" });
            setCurrentPage(1);
          }}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Clear Filters
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="p-4 border rounded shadow-md">
            {editingTask && editingTask._id === task._id ? (
              <form
                onSubmit={updateTask}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="p-2 border rounded"
                />

                {/* Editing Due Date Input with Label */}
                <div>
                  <label
                    htmlFor={`editingDueDate-${task._id}`}
                    className="block mb-1 text-sm font-semibold"
                  >
                    Due Date
                  </label>
                  <input
                    id={`editingDueDate-${task._id}`}
                    type="date"
                    value={editingTask.dueDate.split("T")[0]}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="p-2 border rounded"
                  />
                </div>

                <select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, status: e.target.value })
                  }
                  className="p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p>{task.description}</p>
                <p
                  className={`${getStatusColor(
                    task.status
                  )} p-1 rounded inline-block`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                    }}
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-600 py-1 px-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-600 py-1 px-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
