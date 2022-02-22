const productTable = document.getElementById("div-productos")
const msgBoxElement = document.getElementById("message-box")
const sendBtnElement = document.getElementById("send-btn")
const messageInputElement = document.getElementById("message-input")
const inputEmailElement = document.getElementById("email-input")

async function getProducts(){
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
getProducts()

const comm = io();
comm.emit('login', 'guest')
comm.on('products', getProducts);
comm.on('message', render)
comm.on('messages', loadMessages)

sendBtnElement.addEventListener('click', (e) => {
    e.preventDefault();

    if (!messageInputElement.value || !inputEmailElement.value){
        alert('Debe ingresar un correo y un mensaje.');
        return
    }

    inputEmailElement.disabled = true
    const message = {
        text: messageInputElement.value,
        email: inputEmailElement.value,
        date: Date.now()
    }
    comm.emit('message', message)
    render(message)
    messageInputElement.value = null
})

function render(data) {
    const msgElement = document.createElement("div")
    const userEl = `<span class="chat-data-user">${data.email}</span>`
    const timeEl = `<span class="chat-data-date-time">${new Date(data.date).toLocaleString()}</span> &nbsp;`
    const cssClass = "msg-box"
    msgElement.classList.add(cssClass)
    msgElement.innerHTML = `
    <div class="message-data">
      ${userEl} [ ${timeEl}] escribió: 
    </div>
    <div class="message-body">${data.text}</div>
    `
    msgBoxElement.appendChild(msgElement)
    msgBoxElement.scrollTop = msgBoxElement.scrollHeight // scroll hasta abajo
}

function loadMessages(data){
    for (msgIndex in data){
        render(data[msgIndex])
    }
}