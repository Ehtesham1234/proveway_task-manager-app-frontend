import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
      const response = await axios.get(`http://localhost:5000/api/v1/tasks`, {
        params: {
          page: currentPage,
          limit: 10,
          ...filters,
        },
      });
      setTasks(response.data.data.tasks);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/categories"
      );
      setCategories(response.data.data.categories);
      console.log(response.data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/tasks", newTask);
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
      await axios.put(
        `http://localhost:5000/api/v1/tasks/${editingTask._id}`,
        editingTask
      );
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`);
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <form onSubmit={createTask} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="mr-2 p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className="mr-2 p-2 border rounded"
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
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Task
        </button>
      </form>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="mr-2 p-2 border rounded"
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
          className="mr-2 p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={filters.dueDate}
          onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
          className="mr-2 p-2 border rounded"
        />
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
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="mb-4 p-4 border rounded">
            {editingTask && editingTask._id === task._id ? (
              <form onSubmit={updateTask}>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="mr-2 p-2 border rounded"
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
                  className="mr-2 p-2 border rounded"
                />
                <input
                  type="date"
                  value={editingTask.dueDate.split("T")[0]}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, dueDate: e.target.value })
                  }
                  className="mr-2 p-2 border rounded"
                />
                <select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, status: e.target.value })
                  }
                  className="mr-2 p-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={editingTask.category}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, category: e.target.value })
                  }
                  className="mr-2 p-2 border rounded"
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
                  className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 text-white py-1 px-2 rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                <p>Category: {task.category ? task.category.name : "N/A"}</p>
                <span
                  className={`inline-block px-2 py-1 rounded ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <div className="mt-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
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
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
