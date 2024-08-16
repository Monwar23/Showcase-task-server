const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.as3doaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const ProductCollection=client.db('ProductStore').collection('StoreProduct')

    app.get('/products',async(req,res)=>{
        const { search = '', sort = 'recent' } = req.query;
            const query = search ? { name: { $regex: search, $options: 'i' } } : {};
            const sortOption = sort === 'recent' ? { creation_date: -1 } : { creation_date: 1 };
            const result = await ProductCollection.find(query).sort(sortOption).toArray();
            res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
    res.send('running server');
});

app.listen(port, () => {
    console.log(`server is running in port ${port}`);
});