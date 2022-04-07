
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://coderhouse:c0d3rhouse@cluster0.t24lv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
