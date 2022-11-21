const taskCollection = () => ({
    validator: {
        $jsonSchema: {
           bsonType: "object",
           title: "Task Object Validation",
           required: ["name", "completed", "startDate", "dueDate", "endDate", "createdAt"],
           properties: {
             _id : { bsonType: "objectId" },
             name: {
                 bsonType: "string",
             },
             completed: {
                 bsonType: "bool"
             },
             startDate: {
                 bsonType: "date"
             },
             dueDate: {
                 bsonType: "date"
             },
             endDate: {
                 bsonType: "date"
             },
             createdAt: {
                bsonType: "date"
            },
             projectId: {
                bsonType: "objectId"
             }
           }
        }
     }
})

module.exports = { taskCollection };