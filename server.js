const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    // Start the server once the database connection is established
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    // Optionally, you can exit the process if the connection fails
    process.exit(1);
});

app.use(cors());
app.use(bodyParser.json());

const NoteSchema = new mongoose.Schema({
    text: String,
    subject: String,
});

const Note = mongoose.model('Note', NoteSchema);

// Routes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/notes', async (req, res) => {
    try {
        const newNote = new Note({
            text: req.body.text,
            subject: req.body.subject,
        });
        await newNote.save();
        res.json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});
