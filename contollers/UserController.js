// Import - Model
const User = require('../models/User')

// Import - Dependencias
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Resgatando a palavra "Segredo" do arquivo dotenv
const jwtSecret = process.env.JWT_PASS || "13AMOaMEL05"

/**
 * Gerando Token para o usuário
 * Recebe o id do usuário como parâmetro
 * 
 * jwt.sign()
 * 1 - payload - carga útil
 * 2 - palavra secreta para codificação
 * 3 - opções do login - no caso, definimos que o token expire em 7 dias
 */
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: "7d"
    })
}

// Registrando o usuário e fazendo o sign in
const register = async (req, res) => {
    // Resgatando os dados do body
    const {name, email, password} = req.body

    // Verificando se o usuáio já existe
    const user = await User.findOne({ email })

    if(user){
        res.status(422).json({errors: ["E-mail já cadastrado."]})
        return
    }

    // Transformando a senha em hash - codificando-a
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    // Criando o usuário
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })


    // Validação para verificar se o usuário foi criado e se sim, retornando o Token de autenticação
    if(!newUser) {
        res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde."]})
        return
    }

    // Retornando o token de autenticação para o front-end
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })

}

// Função para que efetuar o processo de login
const login = async (req, res) => {
    
    // Resgatando os dados do body
    const {email, password} = req.body

    // Verificando se o usuário existe
    const user = await User.findOne({ email })

    if(!user) {
        res.status(404).json({errors: ['Usuário não encontrado.']})
        return
    }

    // Validação para verificar se a senha passada é correta
    if(!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({errors: ['Senha inválida.']})
        return
    }

    // Retornando o token de autenticação para o front-end
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage, // Se não houver imagem, esse campo não será repassado
        token: generateToken(user._id)
    })
}

// Função que retorna o usuário autenticado atual
const getCurrentUser = (req, res) => {
    // Resgatando o usuário passado pelo middleware authGuard
    const user = req.user

    // Retornando o usuário
    res.status(200).json(user)
}

// Função responsável por atualizar os dados de um usuário
const update = async (req, res) => {
    
    // Resgatando os dados do body
    const {name, password, bio} = req.body

    let profileImage = null

    // Pegando o nome da imagem alterado pelo middleware que utiliza o multer
    if(req.file) {
        profileImage = req.file.filename
    }

    // Resgatando o usuário que foi passado pelo middleware de authGuard
    const reqUser = req.user

    // Buscando o usuário no BD
    const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-password")

    // Validações para atualizar os dados
    if(name) user.name = name

    if(password) {
        // Transformando a senha em hash - codificando-a
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
    }

    if(profileImage) user.profileImage = profileImage

    if(bio) user.bio = bio

    // Atualizando os dados do usuário
    await user.save()

    // Retornando o usuário atualizado de volta para o front
    res.status(200).json(user)
}

// Função responsável por resgatar dados de um usuário pelo ID
const getUserById = async (req, res) => {

    // Resgatando o ID da URL 
    const {id} = req.params

    try {
        // Buscando o usuário pelo ID
        const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password")

        // Validação para verificar se o usuário foi encontrado
        if(!user) {
            res.status(404).json({errors: ["Usuário não encontrado."]})
            return
        }

        // Retornando o usuário encontrado
        res.status(200).json(user)
        
    } catch (error) {
        res.status(404).json({errors: ["Usuário não encontrado."]})
    }
}



module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById
}