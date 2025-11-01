// Criação de um cliente MongoDB e conexão com o banco de dados

const { MongoClient } = require('mongodb');

async function runGetStarted() {
  // Troque '<connection string URI>' pela sua string de conexão do MongoDB
  const uri = 'mongodb+srv://jonathan:1234@cluster0.h3hwiyv.mongodb.net/?appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Procura por um filme com o título 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    await client.close();
  }
}
runGetStarted().catch(console.dir);