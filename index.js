
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gzpz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const servicecollection = client.db("data").collection("service");
    const ordercollection = client.db("data").collection("orders");
    const usercollection = client.db("data").collection("users");
    app.get('/data', async (req, res) => {
      const query = {};
      const cursor = servicecollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/data/:id', async (req, res) => {
      const id =req.params.id;
      const query = { _id: ObjectId(id)};
      const services = await servicecollection.findOne(query);
      res.send( services);
    });
    

    // app.post("/data", async (req, res) => {
    //   const newData = req.body;
    //   const result = await serviceCollection.insertOne(newData);
    //   res.send(result);
    // });


    // app.get('/order', async (req, res) => {
    //   const query = {};
    //   const cursor = oderCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    app.get('/order', async (req, res) => {
      const email =req.query.email;
      const query={email:email}
      // const result = await userCollection.find(query).toArray();
      const result =await usercollection.find(query).toArray();

      res.send(result);
    });


    app.post("/order", async (req, res) => {
      const newData = req.body;
      const result = await ordercollection.insertOne(newData);
      res.send(result);
    });


    // app.delete("/order/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await oderCollection.deleteOne(query);
    //   res.send(result);
    // });


    // app.put('/user/:email',async(req,res)=>{
    //   const email =req.params.email;
    //   const user=req.body;
    //   const filter={email:email};
    //   const options ={upsert:true};
    //   const updateDoc={
    //     $set:user,
    //   }
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   // const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    //   // res.send({ result, token });
    //   res.send(result)
    // })
  }

  finally {

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('MONGODB CRUD IS RUNNING')
})

app.listen(port, () => {
  console.log(`Listing toolsManufacturer is connect ${port}`)
})