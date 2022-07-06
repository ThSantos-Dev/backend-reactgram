const express = require('express');
const router = express()

// Importando o arquivo de rotas de usuário e adicionando um prefixo
router.use("/api/users", require("./UserRoutes"))
router.use("/api/photos", require("./PhotoRoutes"))


// Test route
router.get('/', (req, res) => {
    res.send("API WORKING")
})






module.exports = router