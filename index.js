import express from 'express';

//instanciar express
const app = express();

//la constante que guarda el puerto
const port = 3000;

//el requirement y el response que permiten tomar la solicitud y la respues al server
app.get('/', (req, res) => {
  res.send(`<h1>Hola mundo</h1>`)
})

//Escuchar por el puerto port, que guarda el valor 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})