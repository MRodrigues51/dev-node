const express = require('express')

const server = express()

server.get("/hello", (req, res) => {
    const { nome, idade } = req.query

    return res.json({
        title: "Hello Word",
        message: `Olá ${nome}!`,
        idade: idade,
    })
})

server.get("/hello/:nome", (req, res) => {
    const nome = req.params.nome
    return res.json({
        title: "Hello Word",
        message: `Olá ${nome}!`,    
    })
})

server.listen(3000)