const { connectToServer } = require("./db");
const { projectCollection } = require("../models/project");
const { taskCollection } = require("../models/task");

(async() => {
    connectToServer(async(dbConnection) => {
        console.log('Creating projects collection...');
        await dbConnection.createCollection("projects", projectCollection());
        
        console.log('Creating tasks collection...');
        await dbConnection.createCollection("tasks", taskCollection());

        console.log('Creating search indexes...');
        await dbConnection.collection("tasks").createIndex({name: "text"});
        await dbConnection.collection("projects").createIndex({name: "text"});
        process.exit(0);
    });
})()