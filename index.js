const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb://rizon:9sIzBz6uh5bY2sBx@ac-pobbpqj-shard-00-00.w583tzt.mongodb.net:27017,ac-pobbpqj-shard-00-01.w583tzt.mongodb.net:27017,ac-pobbpqj-shard-00-02.w583tzt.mongodb.net:27017/?ssl=true&replicaSet=atlas-tj08ys-shard-0&authSource=admin&retryWrites=true&w=majority"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const taskCollection = client.db("jobTask").collection("tasks");

    app.post("/createTask", async (req, res) => {
      const taskData = req?.body;
      const result = await taskCollection.insertOne(taskData);
      res.send(result);
    })

    app.get("/previousTask", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    })

    app.delete("/taskDelete/:id", async (req, res) => {
      const id = req?.params?.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.put("/updateTask/:id", async (req, res) => {
      const updatedData = req?.body;
      const id = req?.params?.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set : {
          ...updatedData
        }
      }
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.put("/statusChange/:id", async (req, res) => {
      const updatedData = req?.body;
      const id = req?.params?.id;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set : {
          ...updatedData
        }
      }
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

  } finally {
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Job Task Planner server")
})

app.listen(port, () => {
  console.log(`Port number ${port}`);
})