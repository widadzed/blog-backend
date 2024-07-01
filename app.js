
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');


app.use(cors( '*'));
app.use(express.json());
const port = 8080;


mongoose.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true
}).then(()=>console.log("connected to MongoDB")).catch((err)=>console.log(err));

  

app.use('/api/posts', require('./routes/postsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

