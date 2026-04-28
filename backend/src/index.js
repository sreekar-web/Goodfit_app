const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true },
});

// MIDDLEWARE
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// MAKE io ACCESSIBLE IN ROUTES
app.set('io', io);

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ status: 'Goodfit API is running 🚀' });
});

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/tryandbuy', require('./routes/tryandbuy'));
app.use('/api/payments', require('./routes/payments'));

// SOCKET.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user's personal room for order updates
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join order tracking room
  socket.on('trackOrder', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Tracking order ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));