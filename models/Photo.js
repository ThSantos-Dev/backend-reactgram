const mongoose = require('mongoose')
const {Schema} = mongoose

// Criando o Esquema para Foto (posts)
const photoSchema = new Schema(
    {
        image: String,
        title: String,
        likes: Array,
        comments: Array,
        userId: mongoose.ObjectId,
        userName: String
    }, 
    {
        timestamp: true
    }
)

// Criando a model
const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo