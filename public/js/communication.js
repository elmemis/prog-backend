const productTable = document.getElementById("div-productos")
const msgBoxElement = document.getElementById("message-box")
const sendBtnElement = document.getElementById("send-btn")

const inputMessageElement = document.getElementById("message-input")
const inputEmailElement = document.getElementById("email-input")
const inputFirstNameElement = document.getElementById("firstname-input")
const inputLastNameElement = document.getElementById("lastname-input")
const inputAgeElement = document.getElementById("age-input")
const inputAliasElement = document.getElementById("alias-input")
const inputAvatarElement = document.getElementById("avatar-input")


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

    if (!inputMessageElement.value || !inputEmailElement.value){
        alert('Debe ingresar un correo y un mensaje.');
        return
    }

    inputEmailElement.disabled = true
    const message = {
        autor: {
            email: inputEmailElement.value,
            nombre: inputFirstNameElement.value,
            apellido: inputLastNameElement.value,
            edad: inputAgeElement.value,
            alias: inputAliasElement.value,
            avatar: inputAvatarElement.value,
        },
        text: inputMessageElement.value,
        date: Date.now()
    }
    comm.emit('message', message)
    render(message)
    inputMessageElement.value = null
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
    //const { normalize, schema } = require("normalizr")
    console.log(denormalize(data))

    for (msgIndex in data){
        render(data[msgIndex])
    }
}