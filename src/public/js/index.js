const socket = io(); 

socket.on("productos", (data)=>{
    renderProductos(data);
})

// renderizado de productos
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("col-sm-4");
        card.innerHTML = `
                <div class="card mb-3">
                    <img src="${item.thumbnails[0].imagen1}" class="card-img-top" alt="Imagen de ejemplo">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}.</p>
                        <p class="card-text">id: ${item.id}, Precio: $<strong>${item.price}</strong></p>
                        <button class="btn btn-danger"> Eliminar</button>
                    </div>
                </div>
        `;
        contenedorProductos.appendChild(card);
        //Agregamos el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
}

//Eliminar producto: 
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnails:[],
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").checked  === "true"
    };
    const nuevaThumbnail ={imagen1: document.getElementById("thumbnails").value}
    
    // Inserta la nueva thumbnail en la primera posición del array
    producto.thumbnails.unshift(nuevaThumbnail);
    socket.emit("agregarProducto", producto);
};
