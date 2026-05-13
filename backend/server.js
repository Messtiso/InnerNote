require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Sentiment = require('sentiment');

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

app.post('/api/analyse', (req, res) => {
    const { journalText } = req.body;

    const result = sentiment.analyze(journalText);

    let mood = 'neutral';

    if(result.score > 0) {
        mood = 'positive';
    } else if(result.score < 0) {
        mood = 'negative';
    }

    res.json({
    mood: mood,
    score: result.score,
    comparative: result.comparative,
    keywords: result.words
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});