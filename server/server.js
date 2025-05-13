const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const alertRoutes = require('./routes/alertRoutes');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB connection to the 'TE' database
mongoose.connect('mongodb://localhost:27017/TE')
  .then(async () => {
    console.log('Connected to MongoDB TE database');

    const User = require('./models/User');
    const LeaveRequest = require('./models/LeaveRequest');
    const Task = require('./models/Task');
    const Canteen = require('./models/Canteen');
    const CanteenOrder = require('./models/CanteenOrder');
    const MenuItem = require('./models/MenuItem');
    const Alert = require('./models/Alert');

    try {
      // Update existing orders without createdAt
      const ordersWithoutCreatedAt = await CanteenOrder.find({ createdAt: { $exists: false } });
      if (ordersWithoutCreatedAt.length > 0) {
        console.log(`Found ${ordersWithoutCreatedAt.length} orders without createdAt. Updating...`);
        await CanteenOrder.updateMany(
          { createdAt: { $exists: false } },
          { $set: { createdAt: new Date() } }
        );
        console.log('Updated existing orders with createdAt.');
      }
    } catch (err) {
      console.error('Error updating existing orders:', err.message);
    }

    try {
      // Initialize dummy user
      const dummyUser = await User.findOne({ email: 'init@te.com' });
      if (!dummyUser) {
        await new User({
          name: 'Initializer',
          email: 'init@te.com',
          password: await bcrypt.hash('initpassword', 10),
          role: 'employee',
        }).save();
        console.log('Created users collection');
      }

      // Initialize canteen admin
      const dummyCanteenAdmin = await User.findOne({ email: 'canteenadmin@te.com' });
      if (!dummyCanteenAdmin) {
        await new User({
          name: 'Canteen Admin',
          email: 'canteenadmin@te.com',
          password: await bcrypt.hash('canteenadmin123', 10),
          role: 'canteenAdmin',
        }).save();
        console.log('Created canteenAdmin user');
      }

      // Initialize dummy leave request
      const dummyLeave = await LeaveRequest.findOne({ employeeEmail: 'init@te.com' });
      if (!dummyLeave) {
        await new LeaveRequest({
          employeeId: '000000000000000000000000',
          employeeEmail: 'init@te.com',
          leaveType: 'Sick',
          startDate: new Date(),
          endDate: new Date(),
          reason: 'Initializer leave request',
          status: 'pending',
          createdAt: new Date(),
        }).save();
        console.log('Created leaves collection');
      }

      // Initialize dummy task
      const dummyTask = await Task.findOne({ title: 'Initializer Task' });
      if (!dummyTask) {
        await new Task({
          title: 'Initializer Task',
          description: 'Dummy task to initialize collection',
          startDate: new Date(),
          endDate: new Date(),
          assignedTo: 'init@te.com',
          notified: false,
        }).save();
        console.log('Created tasks collection');
      }

      // Initialize dummy canteen request
      const dummyCanteen = await Canteen.findOne({ requestType: 'Initializer Request' });
      if (!dummyCanteen) {
        await new Canteen({
          employeeId: '000000000000000000000000',
          employeeEmail: 'init@te.com',
          name: 'Initializer',
          requestType: 'Initializer Request',
          orderDetails: 'Dummy canteen order to initialize collection',
          details: 'Dummy canteen request to initialize collection',
          requestDate: new Date(),
        }).save();
        console.log('Created canteens collection');
      }

      // Initialize dummy menu items
      const dummyMenuItem = await MenuItem.findOne({ name: 'Pancakes' });
      if (!dummyMenuItem) {
        await MenuItem.insertMany([
          { name: 'Pancakes', category: 'Breakfast', price: 4, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Omelette', category: 'Breakfast', price: 5, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Chicken Curry', category: 'Lunch', price: 8, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Rice Bowl', category: 'Lunch', price: 6, available: false, image: 'https://placehold.co/100x100' },
          { name: 'Chips', category: 'Snacks', price: 2, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Sandwich', category: 'Snacks', price: 3, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Coffee', category: 'Beverages', price: 2, available: true, image: 'https://placehold.co/100x100' },
          { name: 'Juice', category: 'Beverages', price: 3, available: true, image: 'https://placehold.co/100x100' },
        ]);
        console.log('Created menu items collection');
      }

      // Initialize dummy alert
      const dummyAlert = await Alert.findOne({ sentBy: 'init@te.com' });
      if (!dummyAlert) {
        await new Alert({
          message: 'Welcome to AdminAcquisition!',
          sentBy: 'init@te.com',
          sentTo: 'all',
          status: 'sent',
        }).save();
        console.log('Created alerts collection');
      }

      console.log('All collections initialized successfully');
    } catch (err) {
      console.error('Error initializing collections:', err.message);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const User = require('./models/User');
const LeaveRequest = require('./models/LeaveRequest');
const Task = require('./models/Task');
const Canteen = require('./models/Canteen');
const CanteenOrder = require('./models/CanteenOrder');
const MenuItem = require('./models/MenuItem');
const Alert = require('./models/Alert');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ msg: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Menu Routes
app.get('/api/menu', authenticateToken, async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.post('/api/menu', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  const { name, category, price, available, image } = req.body;
  if (!name || !category || !price || !image) {
    return res.status(400).json({ msg: 'All fields (name, category, price, image) are required' });
  }
  try {
    const menuItem = new MenuItem({ name, category, price, available, image });
    await menuItem.save();
    res.status(201).json({ msg: 'Menu item added successfully', menuItem });
  } catch (err) {
    res.status(400).json({ msg: 'Error adding menu item', error: err.message });
  }
});

app.put('/api/menu/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  const { name, category, price, available, image } = req.body;
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, category, price, available, image },
      { new: true, runValidators: true }
    );
    if (!menuItem) return res.status(404).json({ msg: 'Menu item not found' });
    res.json({ msg: 'Menu item updated successfully', menuItem });
  } catch (err) {
    res.status(400).json({ msg: 'Error updating menu item', error: err.message });
  }
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) return res.status(404).json({ msg: 'Menu item not found' });
    console.log(`Menu item deleted: ${req.params.id}`); // Debugging log
    res.json({ msg: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(`Error deleting menu item ${req.params.id}:`, err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// User Routes
app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role === 'canteenAdmin') {
    return res.status(400).json({ msg: 'Canteen Admin role cannot be registered' });
  }
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.status(201).json({ msg: 'User created successfully', token, role: user.role });
  } catch (err) {
    res.status(400).json({ msg: 'Error creating user', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Canteen Order Routes
app.post('/api/canteen/order', authenticateToken, async (req, res) => {
  const { foodName, quantity, price } = req.body;
  if (req.user.role === 'canteenAdmin') return res.status(403).json({ msg: 'Canteen Admin cannot place orders' });
  try {
    const total = price * quantity;
    let userName = req.user.name;
    if (!userName) {
      const user = await User.findById(req.user.id).select('name');
      userName = user ? user.name : 'Unknown User';
    }
    const order = new CanteenOrder({
      userId: req.user.id,
      userEmail: req.user.email,
      name: userName,
      foodName,
      quantity,
      price,
      total,
      createdAt: new Date(),
    });
    await order.save();
    console.log('Order saved successfully:', order);
    res.status(201).json({ msg: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ msg: 'Error placing order', error: err.message });
  }
});

app.get('/api/canteen/orders', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const orders = await CanteenOrder.find().sort({ createdAt: -1 });
    console.log('Fetched all orders:', orders.map(o => ({ _id: o._id, status: o.status, foodName: o.foodName })));
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/canteen/order-history/:email', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const orders = await CanteenOrder.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching order history:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.put('/api/canteen/order/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin') return res.status(403).json({ msg: 'Access denied' });
  const { status, adminMessage } = req.body;
  if (!['pending', 'approved', 'declined'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }
  try {
    const order = await CanteenOrder.findByIdAndUpdate(
      req.params.id,
      { status, adminMessage, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    console.log('Order updated:', { _id: order._id, status: order.status, foodName: order.foodName });
    res.json({ msg: 'Order updated successfully', order });
  } catch (err) {
    console.error('Error updating order:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Leave Request Routes
app.post('/api/leave/request', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ msg: 'Access denied' });
  const { leaveType, startDate, endDate, reason } = req.body;
  console.log('Received leave request data:', { leaveType, startDate, endDate, reason });
  try {
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ msg: 'All fields (leaveType, startDate, endDate, reason) are required' });
    }
    const leave = new LeaveRequest({
      employeeId: req.user.id,
      employeeEmail: req.user.email,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
      createdAt: new Date(),
    });
    await leave.save();
    console.log('New leave request created:', leave);
    res.status(201).json({ msg: 'Leave request submitted successfully', leave });
  } catch (err) {
    console.error('Error submitting leave request:', err.message);
    res.status(400).json({ msg: 'Error submitting leave request', error: err.message });
  }
});

app.get('/api/leave/employee', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ msg: 'Access denied' });
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    console.log('Fetched employee leave requests:', leaves.map(l => ({ _id: l._id, status: l.status })));
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching employee leave requests:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/leave/history/:email', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const leaves = await LeaveRequest.find({ employeeEmail: req.params.email }).sort({ createdAt: -1 });
    console.log(`Fetched leave history for ${req.params.email}:`, leaves.map(l => ({ _id: l._id, status: l.status })));
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leave history:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/leave/admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const leaves = await LeaveRequest.find().sort({ createdAt: -1 });
    console.log('Fetched leave requests:', leaves.map(l => ({ _id: l._id, status: l.status, employeeEmail: l.employeeEmail })));
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.put('/api/leave/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { status, adminMessage } = req.body;
  if (!['pending', 'approved', 'declined'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminMessage, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!leave) return res.status(404).json({ msg: 'Leave request not found' });
    console.log('Leave request updated:', { _id: leave._id, status: leave.status, employeeEmail: leave.employeeEmail });
    res.json({ msg: 'Leave request updated successfully', leave });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Task Routes
app.post('/api/tasks/assign', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { title, description, startDate, endDate, assignedTo } = req.body;
  try {
    const task = new Task({
      title,
      description,
      startDate,
      endDate,
      assignedTo,
      notified: false,
    });
    await task.save();
    res.status(201).json({ msg: 'Task assigned successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Error assigning task', error: err.message });
  }
});

app.get('/api/tasks/admin', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/tasks/employee', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ msg: 'Access denied' });
  try {
    const tasks = await Task.find({ assignedTo: req.user.email });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { status, progress, notified } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedTo !== req.user.email) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status, progress, notified },
      { new: true }
    );
    res.json({ msg: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// User Management Routes
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'canteenAdmin' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.get('/api/users/employees', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const employees = await User.find({ role: 'employee' }).select('name email');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.role === 'admin' || user.role === 'canteenAdmin' || user._id.toString() === req.user.id) {
      return res.status(403).json({ msg: 'Cannot delete admin, canteenAdmin, or yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Integrate alertRoutes
app.use('/api/alerts', alertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));