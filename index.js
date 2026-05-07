const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json());

app.use('/api', routes);

const PORT = 80;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});