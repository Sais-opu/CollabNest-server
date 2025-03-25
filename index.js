const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors()); // This allows all origins
app.use(cors());
app.use(express.json()); // This should be before the routes
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ih9r7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        const database = client.db('collabNest');
        coursesCollection = database.collection('tasks');
        userCollection = database.collection('user')

        app.get('/tasks', async (req, res) => {
            try {
                const data = await coursesCollection.find({}).toArray(); // Fetch all documents
                res.json(data);
            } catch (error) {
                res.status(500).json({ message: "Error fetching data", error });
            }
        });

        app.post('/tasks', async (req, res) => {
            try {
                const task = req.body; // Ensure the request body contains the selected status
                const result = await coursesCollection.insertOne(task);
                res.status(201).json({ message: "Task added successfully", task: result });
            } catch (error) {
                res.status(500).json({ message: "Error adding task", error });
            }
        });
        
        app.put('/tasks/:id', async (req, res) => {
            const taskId = req.params.id;
            const updatedTask = req.body;
            
            try {
                const result = await client
                    .db("taskDB")  // Use your actual database name
                    .collection("tasks")
                    .updateOne({ _id: new MongoClient.ObjectId(taskId) }, { $set: updatedTask });
                
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: "Task updated successfully." });
                } else {
                    res.status(404).json({ message: "Task not found." });
                }
            } catch (err) {
                res.status(500).json({ message: "Error updating task.", error: err });
            }
        });
        
        app.post('/user', async (req, res) => {
            const { fullName, email, photoURL, userRole, registrationDate } = req.body;
            console.log(req.body);  // Log the incoming request body for debugging
        
            try {
                // Insert the user info into the MongoDB database
                const result = await userCollection.insertOne({
                    fullName,
                    email,
                    photoURL,
                    userRole,
                    registrationDate,
                });
        
                console.log("User inserted:", result);  // Log the insertion result
        
                res.status(201).json({ message: "User information saved successfully", user: result });
            } catch (error) {
                console.error("Error saving user data:", error);
                res.status(500).json({ message: "Error saving user data", error });
            }
        });
        
        
        
        
        
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// ------------------------------------------------
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Team is on')
})

app.listen(port, () => {
    console.log(`Team ${port}`)
})