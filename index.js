//la libreria de expres
import express from 'express';

//soporte para utilizar el sistema de archivos
import fs from 'fs';

//libreria para que el app pueda entender los body de las req
import bodyParser from 'body-parser';

//instanciar express
const app = express();

//indicando que la app usara el body parser para entender bodys en JSON
app.use(bodyParser.json());

//la constante que guarda el puerto
const port = 3000;

//funcion para leer el JSON
const leerDatos  = () =>{
  try{
    //leer el contenido de un path
    const data = fs.readFileSync('./db.json');
  
    //retornar el JSON <- biene un objeto con notacion js y el JSON.parse lo convierte en JSON
    return JSON.parse(data);
  }catch(error){
    console.log(`Error con ls lectura de los datos: ${error}`);
  }
}

//funcion para escribir datos en el JSON
const escribirDatos = (data) => {
  try{
    /*fs permite acceder al sistema de archivos, write para escribir en
      el archivo cuya ruta es ./db.json, el JSON.stringify permite escribir los datos
      recibidos en formato JSON 
    */ 
    fs.writeFileSync('./db.json', JSON.stringify(data));
  }catch (error){
    console.log(`Error al escribir los datos: ${error}`);
  }
}

//GET
//el requirement y el response que permiten tomar la solicitud y la respues al server
app.get('/', (req, res) => {
  res.send(`<h1>Biencenido al Proyecto Libros</h1>`);
});

//devolver libros
app.get('/libros', (req, res) => {
  //llamar a funcion leer datos que devuelve los libros del archivo ./db.json
  const data = leerDatos();
  //enviar los datos en formato JSON
  res.json(data.libros);
});

app.get('/libros/:id', (req,res)=>{
  const data = leerDatos();
  //convertir del id recibido a entero
  const id = parseInt(req.params.id);
  //encontrar el libro con el mismo id
  const libro = data.libros.find((libro) => libro.id === id);
  //enviar el libro con formato json
  res.json(libro);
});

//POST
app.post('/libros',(req, res)=>{
  //funcion de leer datos
  const data = leerDatos();
  //capturar el cuerpo de la solicitud
  const body = req.body;
  //crear el objeto libro para agregarlo
  const nuevoLibro = {
    //calcular el id, obtiene el ultimo y le suma 1
    id: data.libros.length +1,
    //trae los elementos del json y los coloca en el objeto, deberia tenerse cuidado con los nombres
    ...body
  };
  //añadir el libro al vector
  data.libros.push(nuevoLibro);
  //guardar en el archivo
  escribirDatos(data);

  res.json(data);
});

//PUT <- para actualizacion
app.put('/libros/:id',(req, res)=>{
  //llamar a la funcion leer libros
  const data = leerDatos();
  //obtener los datos enviados en el contenido de la solicitud
  const body = req.body;
  //obtener el id del libro a editar en la url
  const id = parseInt(req.params.id);
  //obtener la posicion del libro dobde coincidan los id
  const indiceLibro = data.libros.findIndex((libro) => libro.id === id);
  //obtener el objeto del libro en el indice encontrado y editarlo
  data.libros[indiceLibro] = {
    ...data.libros[indiceLibro],
    ...body
  };
  //guardaar en el archivo
  escribirDatos(data);
  //responder con los libros como quedaron
  res.json(data);
});

//DELETE
app.delete('/libros/:id', (req, res)=>{
  //funcion leer los datos
  const data = leerDatos();
  //el id que viene en la solicitud, en la url
  const id = parseInt(req.params.id);
  //obtener el indice del libro en la posicion donde coincidan los id
  const indiceLibro = data.libros.findIndex((libro) => libro.id === id);
  //eliminar el libro del arreglo, el idice obtenido y elimina solamente 1
  data.libros.splice(indiceLibro, 1);
  //escribir en el archivo
  escribirDatos(data);
  //responder con los libros que quedan
  res.json(data);
});

//Escuchar por el puerto port, que guarda el valor 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});