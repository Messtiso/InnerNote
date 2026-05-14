require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Sentiment = require('sentiment');
const JournalEntry = require('./models/JournalEntry');

const app = express();

const PORT = 5000;

const sentiment = new Sentiment();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('MongoDB connection error:', error);
    });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('InnerNote backend is running');
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend connection successful'
    });
});

app.post('/api/analyse', async (req, res) => {
    const { journalText } = req.body;

    const result = sentiment.analyze(journalText);

    let mood = 'neutral';

    if(result.score > 0) {
        mood = 'positive';
    } else if(result.score < 0) {
        mood = 'negative';
    }

    const savedEntry = await JournalEntry.create({
        text: journalText,
        mood: mood,
        score: result.score,
        keywords: result.words
    });

    res.json({
        id: savedEntry._id,
        mood: savedEntry.mood,
        score: savedEntry.score,
        keywords: savedEntry.keywords,
        createdAt: savedEntry.createdAt
    });
});

app.get('/api/entries', async (req, res) => {
    try {
        const entries = await JournalEntry.find().sort({ createdAt: -1});

        res.json(entries);
    } catch (error) {
        res.status(500).json({
            message: 'Could not fetch journal entries'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});