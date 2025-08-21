import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DB ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todos';
await mongoose.connect(MONGODB_URI);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// --- API ---
app.get('/api/todos', async (req, res) => {
  const items = await Todo.find().sort({ createdAt: -1 });
  res.json(items);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
  const created = await Todo.create({ title: title.trim() });
  res.status(201).json(created);
});

app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const update = {};
  if (typeof title === 'string') update.title = title.trim();
  if (typeof completed === 'boolean') update.completed = completed;
  const updated = await Todo.findByIdAndUpdate(id, update, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Todo.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server listening on http://localhost:${PORT}`));