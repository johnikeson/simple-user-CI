const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const DEFAULT_IMAGE = "https://i.pravatar.cc/150?img=12";

async function start() {
  await client.connect();

  const db = client.db('user-account');
  const users = db.collection('users');

  console.log("Connected to MongoDB");

  // ------------------------
  // HOME PAGE - SHOW USERS
  // ------------------------
  app.get('/', async (req, res) => {
    const allUsers = await users.find().toArray();
    res.render('index', { users: allUsers });
  });

  // ------------------------
  // ADD USER
  // ------------------------
  app.post('/add', async (req, res) => {
    const { name, email } = req.body;

    await users.insertOne({
      name,
      email,
      image: DEFAULT_IMAGE
    });

    res.redirect('/');
  });

  // ------------------------
  // UPDATE USER
  // ------------------------
  app.post('/update/:id', async (req, res) => {
    const { name, email } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields }
    );

    res.redirect('/');
  });

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

start();