const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 5050;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
 
// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT)

.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));
 
// Import job-related functions
const { searchJobs } = require('./utils/search-job.js');
app.get('/search-jobs', searchJobs);

const { addJob } = require('./utils/create-job');
app.post('/add-job', addJob);
 
const { editJob, getJobById } = require('./utils/update-job');
app.put('/edit-job/:id', editJob);
app.get('/view-job/:id', getJobById);
 
const { viewJobs } = require('./utils/view-job');
app.get('/view-jobs', viewJobs);

const { applyjob } = require('./utils/applyjob');
app.post('/apply-job', applyjob);
 
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
 
const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address === "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`DevOps project at: ${baseUrl}`);
});
 
module.exports = { app, server };