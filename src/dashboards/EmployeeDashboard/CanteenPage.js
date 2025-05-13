import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FoodCard = ({ food, onOrder }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
    <img src={food.image} alt={`Image of ${food.name}`} className="w-full h-40 object-cover rounded-xl mb-4" />
    <h3 className="text-xl font-semibold text-gray-900">{food.name}</h3>
    <p className="text-sm text-gray-600">{food.category}</p>
    <p className="text-lg font-bold text-teal-600 mt-2">₹{food.price.toFixed(2)}</p>
    <button 
      onClick={() => onOrder(food)} 
      className="mt-4 w-full bg-teal-500 text-white py-2 px-4 rounded-xl hover:bg-teal-600 transition-colors duration-300"
      disabled={!food.available}
    >
      {food.available ? 'Order' : 'Not Available'}
    </button>
  </div>
);

const CategorySection = ({ category, foods, onOrder }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold mb-6 text-teal-700">{category}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {foods.length > 0 ? (
        foods.map(food => <FoodCard key={food._id} food={food} onOrder={onOrder} />)
      ) : (
        <p className="text-gray-500 italic">No items available in this category.</p>
      )}
    </div>
  </div>
);

const OrderModal = ({ food, quantity, setQuantity, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-11/12 md:w-1/3">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">Order {food.name}</h2>
      <img src={food.image} alt={`Image of ${food.name}`} className="w-full h-40 object-cover rounded-xl mb-4" />
      <p className="text-xl font-bold text-teal-600 mb-6">₹{food.price.toFixed(2)}</p>
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
          min="1"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button 
          onClick={onClose} 
          className="bg-gray-300 text-gray-800 py-2 px-5 rounded-xl hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm} 
          className="bg-teal-500 text-white py-2 px-5 rounded-xl hover:bg-teal-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const CanteenPage = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Breakfast");
  const [pendingAmount, setPendingAmount] = useState(0);
  const [foodData, setFoodData] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) navigate('/login');
    fetchMenuItems();
    const interval = setInterval(fetchMenuItems, 5000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoodData(response.data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  const handleOrder = (food) => {
    if (food.available) setSelectedFood(food);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
    setQuantity(1);
  };

  const handleConfirmOrder = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/canteen/order',
        {
          foodName: selectedFood.name,
          quantity: parseInt(quantity),
          price: selectedFood.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.msg === 'Order placed successfully') {
        setPendingAmount(prev => prev + selectedFood.price * quantity);
        handleCloseModal();
        alert('Order placed successfully!');
      } else {
        alert(`Failed to place order: ${response.data.msg || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert(`Error connecting to server: ${err.message}`);
    }
  };

  const handleHomeClick = () => {
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'employee') {
      navigate('/employee-dashboard');
    } else if (role === 'canteenAdmin') {
      navigate('/canteen-admin-dashboard');
    } else {
      navigate('/login');
    }
  };

  const categories = [...new Set(foodData.map(food => food.category))];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <nav className="w-full p-4 flex flex-wrap justify-between items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg">
        <div className="text-2xl font-bold">Canteen</div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleHomeClick}
            className="px-4 py-2 rounded-xl bg-white text-teal-600 font-semibold hover:bg-teal-100 transition-colors"
          >
            Home
          </button>
          {categories.length > 0 ? (
            categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl ${
                  selectedCategory === category 
                    ? 'bg-white text-teal-600 font-semibold'
                    : 'hover:bg-teal-100 hover:text-teal-700'
                } transition-colors`}
              >
                {category}
              </button>
            ))
          ) : (
            <p className="text-white">No categories available.</p>
          )}
        </div>
        <div className="text-lg font-semibold">
          Total Amount: <span className="text-yellow-200">₹{pendingAmount.toFixed(2)}</span>
        </div>
      </nav>

      <main className="flex-1 p-8 overflow-y-auto">
        {categories.length > 0 ? (
          categories.map(category => (
            category === selectedCategory && (
              <CategorySection
                key={category}
                category={category}
                foods={foodData.filter(food => food.category === category)}
                onOrder={handleOrder}
              />
            )
          ))
        ) : (
          <p className="text-gray-600 text-center mt-10">No menu items available.</p>
        )}
      </main>

      {selectedFood && (
        <OrderModal
          food={selectedFood}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={handleCloseModal}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
};

export default CanteenPage;