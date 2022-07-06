require("dotenv").config()

// Instaciando o express
const express = require('express');
// Para tranalhar com o upload de imagem
const path = require('path');
// Acesso da mesma máquina
const cors = require('cors');

const port = process.env.PORT || 3000;

// Inicializando a aplicação
const app = express();

// Configuando para aceitar o formato JSON e FORM-DATA
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"}))

// Diretório de upload de imagens
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// Conexão com o bd
require("./config/db.js")

// Rotas
const router = require('./routes/Router.js')
app.use(router)


app.listen(port, () => {
    console.log(`App rodando em: http://localhost:${port} ✨`)
});

