const productTable = document.getElementById("div-productos")

async function getProducts(){
    console.log('Obtener productos...')
    await fetch('/productos')
        .then(response => response.text())
        .then(data => {
            productTable.innerHTML = data
        })
        .catch(error => {
            console.log(`Error: ${error}`)
            productTable.innerHTML = `
            <p>No se pudieron obtener productos.</p>`
            }
        );
};

async function deleteProduct(id){
    console.log(`Eliminar producto ${id}`)
    await fetch(`/productos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        alert(`Producto ${id} eliminado correctamente.`)
    })
    .catch(error => {
        console.log(`Error: ${error}`)
        alert(`No se pudo eliminar el producto ${id}.`)
    })
}


const comm = io();
comm.on('products', getProducts);

getProducts()