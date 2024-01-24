const express = require('express');
const exphbs = require("express-handlebars");
const Socket = require("socket.io")
const hbsRouter = require("./routes/handlebars.router")
const productsRouter = require("./routes/products.router");
//const cartsRouter = require("./routes/carts.router");
const ProductManager = require("./controllers/product-manager.js")

// Crea una instancia de Express
const app = express();
// Define el puerto en el que el servidor escuchará
const PUERTO = 8080;
//instancia de productManager para usar con Socket
const productManager = new ProductManager("./src/models/products.json")

//configuracion necesaria para utilizar archivos JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//archivos estaticos
app.use(express.static("./src/public"));

//Configuramos handlebars: 
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



//Routing
app.use("/api/products", productsRouter)
app.use("/", hbsRouter);
//app.use("/api/carts", cartsRouter )

// Inicia el servidor y escucha en el puerto especificado


const httpServer = app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const io = Socket(httpServer);



io.on("connection", async (socket) => {
  console.log("Cliente Conectado")
  socket.emit("productos", await productManager.getProducts());

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.sockets.emit("productos", await productManager.getProducts());
  })

  socket.on("agregarProducto", async (producto) => {
    console.log(producto)
    await productManager.addProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  })

});

