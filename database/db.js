const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://Abelo73:34777843Abelo@backendmd.smj5dqv.mongodb.net/?retryWrites=true&w=majority&appName=BackendMD";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true, // Ensure SSL/TLS is enabled
  tlsAllowInvalidCertificates: true, // Allow invalid certificates (dev/testing only)
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB!");

    // Send a ping to confirm the connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    // Close the client
    await client.close();
  }
}

run().catch(console.dir);
