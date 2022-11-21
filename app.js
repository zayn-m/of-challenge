const express = require('express');
const { connectToServer } = require('./config/db');
const errorHanlder = require("./middleware/error");

const tasks = require("./routes/tasks");
const projects = require("./routes/projects");

const app = express();

app.use(express.json());

connectToServer();

const PORT = process.env.PORT || 5000;

app.use('/api/tasks', tasks);
app.use('/api/projects', projects);
app.use(errorHanlder);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit
    server.close(() => process.exit(1));
});