
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');


app.use(cors( '*'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public/dist')));
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/posts', require('./routes/postsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

