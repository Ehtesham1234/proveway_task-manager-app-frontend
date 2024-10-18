import React, { useState, useEffect } from "react";
import apiService from "../services/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await apiService.createCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await apiService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <form onSubmit={createCategory} className="mb-4">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Category
        </button>
      </form>
      <ul>
        {categories.map((category) => (
          <li key={category._id} className="mb-2 p-2 border rounded">
            <div className="flex justify-between items-center">
              <span>{category.name}</span>
              <div>
                <button
                  onClick={() => deleteCategory(category._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
