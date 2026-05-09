const express = require('express');

const app = express();

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('InnerNote backend is running');
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend connection successful'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});