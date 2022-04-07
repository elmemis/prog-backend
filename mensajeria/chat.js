const Messages = require('../models/messages')

const users = {}

module.exports = (socket) => {
    socket.on('login', async(email) => {
        users[socket.id] = email
        const msgList = await Messages.getAll()
        socket.emit('messages', msgList)
    })

    socket.on('disconnect', function() {
        console.log(`Disconnected: ${socket.id}`)
        console.log(`Disconnected user: ${users[socket.id]}`)
    })

    socket.on("message", async(data) => {
        console.log(data)
        await Messages.create(data)
        //msgList.push(data)
        socket.broadcast.emit('message', data)
    })

    socket.on("products", (data) => {
        socket.broadcast.emit("products", '')
    })
}