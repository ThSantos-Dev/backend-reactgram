// Funções para upload de imagem

// Biblioteca responsável por fazer o upload de arquivos
const multer = require('multer');

// Retorna o caminho até o projeto
const path = require('path');

// Definindo onde as imagens serão armazenadas
const imageStorage = multer.diskStorage({
    // Alterando a pasta padrão de acordo com de onde vem a imagem
    destination: (req, file, callback) => {
        let folder = ""

        if(req.baseUrl.includes("users")) {
            folder = "users"
        } else if(req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        callback(null, `uploads/${folder}/`)
    },
    // Renomeando o arquivo
    filename: (req, file, callback) => {
    
        callback(null, Date.now() + path.extname(file.originalname))

    }
})

// Função que realiza a validação de imagem
const imageUpload = multer ({
    storage: imageStorage,
    fileFilter(req, file, callback) {
        // Validação para verificar se o arquivo informado está em um formato válido
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){

            // Aceita apenas png e jpg
            return callback(new Error("Por favor, envie apena png, jpeg ou jpg"))

        }

        callback(undefined, true)
    }
})

module.exports = { imageUpload }