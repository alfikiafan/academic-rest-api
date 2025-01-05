const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const mataKuliahRoutes = require('./routes/mataKuliahRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/mata_kuliah', mataKuliahRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start REST API Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`REST API is running at http://localhost:${PORT}`);
});
