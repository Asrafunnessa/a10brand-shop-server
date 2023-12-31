const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5500;


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzmsh8k.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // await client.connect();

    const productsCollection = client.db('productsDB').collection('products');
    const cartsCollection = client.db('productsDB').collection('carts');

    app.get('/products', async(req, res) =>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
 
    app.get('/products/:name', async(req, res) =>{
      const name = req.params.name;
      console.log(name);
      const query = {brandName: name};
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/productsId/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    app.get('/details', async(req, res) =>{
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/details', async(req, res) => {
      const addToCart = req.body;
      console.log(addToCart);
      const result = await cartsCollection.insertOne(addToCart);
      res.send(result);
    })

    app.delete('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id:id };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
     
    })


    app.post('/products', async(req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    })

    app.put('/productsId/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const newUpdateProduct = req.body;
      const product = {
        $set: {
          productName: newUpdateProduct.productName,
          image: newUpdateProduct.image,
          brandName: newUpdateProduct.brandName,
          type: newUpdateProduct.type,
          price: newUpdateProduct.price,
          description: newUpdateProduct.description,
          rating: newUpdateProduct.rating,
      
        }
      }
      const result = await productsCollection.updateOne(filter, product, options);
      res.send(result);

    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand shop in running')
})
app.listen(port, () => {
    console.log(`Brand shop is running on port: ${port}`);
})