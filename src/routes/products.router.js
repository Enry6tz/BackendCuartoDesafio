const path = require('path');
const express = require("express");
const router = express.Router();
const productManager = require('../controllers/product-manager.js');


// Obtener la ruta completa al archivo productos.json desde el punto donde se ejecuta este script
const productosJsonPath = path.join(__dirname, '..', '/models/products.json');

// Crea una instancia de ProductManager con la ruta correcta
const ProductManager = new productManager(productosJsonPath);

// Endpoint para obtener todos los productos con posibilidad de limitar resultados
router.get("/", (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        const products =  ProductManager.getProducts();
        // Si limit es falsy, entonces devolvemos todos los productos.
        const limitedProducts = limit ? products.slice(0, limit) : products;
        res.status(200).send({ status: "success", data: limitedProducts });
        console.log("Productos obtenidos con éxito");
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

//endpoint para obtener producto por id
router.get("/:id", async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        // Lógica para buscar el producto por su ID
        const productoEncontrado = await ProductManager.getProductById(productId);
        if (!productoEncontrado) {
            // Si el producto no se encuentra, envía un código de estado 404
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", data: productoEncontrado });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});
router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const status = await ProductManager.addProduct(newProduct);
        if (status === false) {
            res.status(500).send({ status: "error", error: "Error en el producto enviado" });
        }
        else {
            res.json({ status: "success", data: newProduct });
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updateProduct = req.body;
        const productStatus = await ProductManager.updateProduct(id, updateProduct);
        if (productStatus === false) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        else {
            res.json({ status: "success", data: productStatus });
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const productStatus = await ProductManager.deleteProduct(id);
        if (productStatus === false) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        else {
            res.json({ status: "success"});
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

module.exports = router;