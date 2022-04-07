const { faker } = require('@faker-js/faker');

const express = require('express')
const { Router } = express;
const router = Router()

const productosFakers = []


router.get('/productos-test', async(req, res) => { 
    for (let i = 0; i < 5; i++) {
        const producto = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            photo: faker.internet.avatar()
        }

        productosFakers.push(producto)
    }
    console.log(JSON.stringify(productosFakers, null, 2))
    res.send(productosFakers)
})


module.exports = router