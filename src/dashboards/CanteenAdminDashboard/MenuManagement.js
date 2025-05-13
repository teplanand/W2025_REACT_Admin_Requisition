import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: 'Breakfast', price: '', available: true, image: '' });
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', price: '', available: true, image: '' });
  const token = localStorage.getItem('token');

  const categories = ['Breakfast', 'Lunch', 'Snacks', 'Beverages'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error fetching menu items:', err.response ? err.response.data : err.message);
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      alert('Please fill all required fields!');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/menu',
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenuItems([...menuItems, response.data.menuItem]);
      setNewItem({ name: '', category: 'Breakfast', price: '', available: true, image: '' });
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err.response ? err.response.data : err.message);
      alert(`Error adding item: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this menu item?')) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.msg === 'Menu item deleted successfully') {
        setMenuItems(menuItems.filter(item => item._id !== id));
        alert('Menu item deleted successfully!');
      } else {
        alert(`Failed to delete menu item: ${response.data.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error removing item:', err.response ? err.response.data : err.message);
      alert(`Error removing item: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item._id);
    setEditForm({ name: item.name, category: item.category, price: item.price, available: item.available, image: item.image });
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.price || !editForm.image) {
      alert('Please fill all required fields!');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/menu/${editItem}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenuItems(menuItems.map(item => item._id === editItem ? response.data.menuItem : item));
      setEditItem(null);
      setEditForm({ name: '', category: '', price: '', available: true, image: '' });
      alert('Item updated successfully!');
    } catch (err) {
      console.error('Error updating item:', err.response ? err.response.data : err.message);
      alert(`Error updating item: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  const cancelEdit = () => {
    setEditItem(null);
    setEditForm({ name: '', category: '', price: '', available: true, image: '' });
  };

  const toggleAvailability = async (id) => {
    const item = menuItems.find(item => item._id === id);
    const updatedItem = { ...item, available: !item.available };
    try {
      const response = await axios.put(
        `http://localhost:5000/api/menu/${id}`,
        updatedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMenuItems(menuItems.map(item => item._id === id ? response.data.menuItem : item));
    } catch (err) {
      console.error('Error toggling availability:', err.response ? err.response.data : err.message);
      alert(`Error toggling availability: ${err.response ? err.response.data.msg : err.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#2E7D7A]">Menu Management</h1>
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors flex-1"
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors w-24"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newItem.image}
          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
          className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors flex-1"
        />
        <button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors">
          Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Image</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Name</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Category</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Price</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Availability</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {menuItems.map(item => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 border-t">
                  <img src={item.image} alt={`Image of ${item.name}`} className="w-16 h-16 object-cover rounded-lg" />
                </td>
                <td className="py-4 px-4 border-t">
                  {editItem === item._id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border-2 border-gray-200 p-2 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors w-full"
                    />
                  ) : item.name}
                </td>
                <td className="py-4 px-4 border-t">
                  {editItem === item._id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="border-2 border-gray-200 p-2 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors w-full"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : item.category}
                </td>
                <td className="py-4 px-4 border-t">
                  {editItem === item._id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border-2 border-gray-200 p-2 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors w-full"
                    />
                  ) : `₹${item.price}`}
                </td>
                <td className="py-4 px-4 border-t">
                  {editItem === item._id ? (
                    <select
                      value={editForm.available}
                      onChange={(e) => setEditForm({ ...editForm, available: e.target.value === 'true' })}
                      className="border-2 border-gray-200 p-2 rounded-xl focus:outline-none focus:border-[#2E7D7A] transition-colors w-full"
                    >
                      <option value={true}>Available</option>
                      <option value={false}>Out of Stock</option>
                    </select>
                  ) : item.available ? 'Available' : 'Out of Stock'}
                </td>
                <td className="py-4 px-4 border-t">
                  {editItem === item._id ? (
                    <>
                      <button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl transition-colors mr-2">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-xl transition-colors mr-2">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl transition-colors mr-2">
                        Edit
                      </button>
                      <button onClick={() => removeItem(item._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl transition-colors mr-2">
                        Delete
                      </button>
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-xl transition-colors"
                      >
                        {item.available ? 'Mark as Out of Stock' : 'Mark as Available'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagement;
