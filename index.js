const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoModel = require('./Models/Todo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.post('/add', async (req, res) => {
  const task = req.body.task;
  if (!task) {
    return res.status(400).json({ error: 'Task is Required' });
  }
  try {
    const result = await todoModel.create({ task });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await todoModel.findByIdAndUpdate(
      id,
      {
        done: true,
      },
      { new: true } // To return the updated document
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/get', async (req, res) => {
  try {
    const result = await todoModel.find();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await todoModel.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
