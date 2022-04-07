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

function analyze(obj){
    console.log(util.inspect(obj, true, 12, true))
};

function render(data) {
    console.log(data)
    const msgElement = document.createElement("div")
    const userEl = `<span class="chat-data-user">${data.autor.email}</span>`
    const userAv = `<span class="chat-data-user-avatar"><img src="${data.autor.avatar}" width="25px" height="25px"></img></span>`
    const timeEl = `<span class="chat-data-date-time">${new Date(data.date).toLocaleString()}</span> &nbsp;`
    const cssClass = "msg-box"
    msgElement.classList.add(cssClass)
    msgElement.innerHTML = `
    <div class="message-data">
      ${userEl} ${userAv} [ ${timeEl}] escribió: 
    </div>
    <div class="message-body">${data.text}</div>
    `
    msgBoxElement.appendChild(msgElement)
    msgBoxElement.scrollTop = msgBoxElement.scrollHeight // scroll hasta abajo
}

function loadMessages(data){

    /*const autor = new normalizr.schema.Entity("autores", {},{ idAttribute: 'email'})
    const text = new normalizr.schema.Entity("mensajes", {
        autor: autor
    });
    const mensajes = new normalizr.schema.Array(text);*/

    const autor = new normalizr.schema.Entity("autores", {}, { idAttribute: 'email' })
    const mensaje = new normalizr.schema.Entity("mensajes", {
        autor: autor
    });
    const datamsg = new normalizr.schema.Entity("datamsg", {
        mensajes: [mensaje]
    });

    const msgs = normalizr.denormalize(data.result, datamsg, data.entities)
    //console.log(msgs.mensajes)
    analyze(datamsg)

    for (msgIndex in msgs.mensajes){
        render(msgs.mensajes[msgIndex])
    }
}