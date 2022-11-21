const { connectToServer } = require("./config/db");

(async() => {
    connectToServer(async(dbConnection) => {
        // Create the start date which holds the beginning of today
        var todayStart = new Date();
        todayStart.setHours(0,0,0,0);

        // Create the end date which holds the end of today
        var todayEnd = new Date();
        todayEnd.setHours(23,59,59,999);
        const res = await dbConnection.collection("tasks").aggregate( [
            {
                $match: {
                    $or: [
                        {"dueDate": {
                            $gte: todayStart,
                            $lte: todayEnd
                        }},
                    ]
                }
            },
            {
              $lookup:
                {
                  from: "projects",
                  localField: "projectId",
                  foreignField: "_id",
                  as: "projects_docs"
                }
           }
         ] );
        console.log(res)
    });
})()