const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 5000;

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

    res.json({
    mood: 'neutral',
    score: 0,
    message: `Recieved journal entry: ${journalText}`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});