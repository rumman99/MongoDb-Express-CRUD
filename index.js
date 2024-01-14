const express= require('express');
const bodyParser= require('body-parser');
const cors = require('cors');

// Mongo Client and Url //
    const uri = "mongodb+srv://tasnimrumman369:rumman1999@cluster-rumman0.pqu8dwy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
    const client = new MongoClient(uri, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });

const app= express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.options('/users', cors())

app.get('/', (req, res)=> {
    // res.send('Res Working')
    res.sendFile(__dirname+"/index.html")
});

app.listen(3333, console.log('Listening to Port 3333'))



    async function run() {
        try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("organicdb").command({ ping: 1 });
        const database = client.db("organicdb"); //Database Name

        //Api for Read Product on UI //
            app.get('/product', async(req, res)=>{
                const data = await database.collection('products').find({}).toArray();
                res.send(data);
                })

        // Api for Read Editing product //
            app.get('/product/:product_id', async (req, res)=>{
                // console.log(req.params.product_id);
                const data= await database.collection('products').find({_id: new ObjectId(req.params.product_id)}).toArray();
                res.send(data[0])
            });

            ////POST///
            app.post('/productAdd', (req, res)=>{
                database.collection('products').insertOne(req.body, console.log('Added To DataBase :)'))
                res.redirect('/')
            });

        // await database.collection('products').insertOne({ // Reference the "people" collection in the specified database
        //     item: 'mobile',
        //     quantity: 12,
        //     price: 12000,
        //     brand: 'realme'
        // })
        // .then(result => console.log('Product Added'))

            app.delete('/remove/:product_id', (req, res)=>{
                database.collection('products').deleteOne({_id: new ObjectId(req.params.product_id)})
                .then(result => {if(result.deletedCount === 1)
                    res.send(true)
                })
            });

        // Update Specific value Price and Quantity //
            app.patch(`/edit/:product_id`, async (req, res)=>{
                const findProductFromDb= await database.collection('products').updateOne({_id: new ObjectId(req.params.product_id)}, 
                    {
                    $set:{title: req.body.title, brand: req.body.brand, price: req.body.price, quantity: req.body.quantity}
                    })
                if(findProductFromDb.modifiedCount===1){
                    res.send(true);
                }
            })

        console.log("You successfully connected to MongoDB!");
        } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
        }
    }
    run().catch(console.dir);
