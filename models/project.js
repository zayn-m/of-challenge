const projectCollection = () => ({
    validator: {
        $jsonSchema: {
           bsonType: "object",
           title: "Project Object Validation",
           required: ["name", "startDate", "dueDate", "createdAt"],
           properties: {
             _id : { bsonType: "objectId" },
             name: {
                 bsonType: "string",
             },
            startDate: {
                bsonType: "date"
            },
            dueDate: {
                bsonType: "date"
            },
            createdAt: {
                 bsonType: "date"
            },
           }
        }
     }
})

module.exports = { projectCollection };