const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const DEFAULT_IMAGE = "https://media.licdn.com/dms/image/v2/D4E35AQGY1VojsPBzSQ/profile-framedphoto-shrink_800_800/B4EZ4reZmCKsAg-/0/1778845850328?e=1781985600&v=beta&t=3I6fsVE-HN9ezH2pzpWaC4lzbqqrBOMviMD8PgRwI-g";

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
