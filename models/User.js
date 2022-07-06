const mongoose = require("mongoose");
// O model é dividido por Esquema (forma de construção) e o model é o objeto que possui os métodos do CRUD
const { Schema } = mongoose;

// Criação do Schema 
// Contém todas as propriedades do usuário
const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
  },
  {
    timestamps: true
  }
);

// Criação da Model
const User = mongoose.model("User", userSchema);

module.exports = User;
