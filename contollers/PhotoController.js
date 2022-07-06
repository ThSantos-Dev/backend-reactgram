// Controller responsável por lidar com as fotos!

// Importando as models
const User = require("../models/User");
const Photo = require("../models/Photo");
const mongoose = require("mongoose");

// Inserindo uma foto com o usuario relacionado a ela
const insertPhoto = async (req, res) => {
  // Resgatando o título da imagem
  const { title } = req.body;
  // Resgatando o nome da imagem que vem do middleware de upload
  const image = req.file.filename;

  // Resgatando o usuario
  const reqUser = req.user;

  // Buscando mais informações do usuario para colocar os dados do usuário na foto
  const user = await User.findById(reqUser._id);

  // Criando uma foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // Verificando se a foto foi criada com sucesso
  if (!newPhoto) {
    // Retornando uma mensagem de erro
    res
      .status(422)
      .json({ errors: ["Houve um problema, por favor tente mais tarde."] });
  }

  // Retornando os dados da foto
  res.status(201).json(newPhoto);
};

// Excluindo uma foto
const deletePhoto = async (req, res) => {
  // Resgatando o id da foto pela URL
  const { id } = req.params;

  // Resgatando os dados do usuário passado pelo middleware de authGuard
  const reqUser = req.user;

  try {
    // Resgatando a photo
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // Validação para verificar se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    //   Verificando se o usuário pertence ao usuário autenticado
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422),
        json({
          errors: ["Ocorreu um erro, por favor, tente novamente mais tarde."],
        });
      return;
    }

    //   Realizando a exclusão da foto no BD
    await Photo.findByIdAndDelete(photo._id);

    //   Retornando uma mensagem
    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso!" });
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};

// Resgatando todas as fotos
const getAllPhotos = async (req, res) => {
  // Resgatando as fotos do bd
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  // Retornando as fotos
  return res.status(200).json(photos);
};

// Resgatando as fotos do usuário
const getUserPhotos = async (req, res) => {
  // Resgatando o id do usuário pela URL
  const { id } = req.params;

  // Resgatando as fotos desse usuário
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  // Retornando as fotos
  return res.status(200).json(photos);
};

// Buscar foto por ID
const getPhotoById = async (req, res) => {
  // Resgatando o id pela URL
  const { id } = req.params;

  try {
    // Buscando a foto no BD
    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    // Validação para verificar se a foto existe
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada."] });
      return;
    }

    // Retornando a foto
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
  }
};

// Atualizando uma foto
const updatePhoto = async (req, res) => {
  // Resgatando o id pela URL
  const { id } = req.params;

  // Resgatando o título pelo body
  const { title } = req.body;

  // Resgatando o usuário passado pelo middleware de authGuard
  const reqUser = req.user;

  // Buscando pela foto no BD
  const photo = await Photo.findById(mongoose.Types.ObjectId(id));

  // Validação para verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada."] });
    return;
  }

  // Validação para verificar se a foto a ser atualizada pertence ao usuário que fez a requisição
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(401)
      .json({ erros: ["Ocorreu um erro, por favor tente mais tarde"] });
    return;
  }

  // Verificando se o título foi passado
  if (title) {
    photo.title = title;
  }

  // Salvando a atualização
  await photo.save();

  // Retornando a foto atualizada
  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

// Função para Like
const likePhoto = async (req, res) => {
  // Resgatando o id pela URL
  const { id } = req.params;

  // Resgatando o usuário que deu o LIKE
  const reqUser = req.user;

  // Buscando a foto no BD
  const photo = await Photo.findById(mongoose.Types.ObjectId(id));

  // Validação para verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada."] });
    return;
  }

  // Verificando se o usuário já deu like na foto
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ erros: ["Você já curtiu a foto."] });
    return;
  }

  // Adicionando o id do usuario no array de likes
  photo.likes.push(reqUser._id);

  // Atualizando a foto
  photo.save();

  // Retornando uma mensagem
  res.status(200).json({
    photoId: photo._id,
    userId: reqUser._id,
    message: "A foto foi curtida!",
  });
};

// Função para adicionar comentário a foto
const commentPhoto = async (req, res) => {
  // Resgatando o id pela URL
  const { id } = req.params;

  // Resgatando o comentário
  const { comment } = req.body;

  // Resgatando o usuário que enviou o comentário
  const reqUser = req.user;

  // Buscando o usuário no BD
  const user = await User.findById(reqUser._id)

  // Buscando a foto pelo ID
  const photo = await Photo.findById(mongoose.Types.ObjectId(id))

  // Validação para verificar se a foto existe
  if (!photo) {
    res.status(404).json({ erros: ["Foto não encontrada."] });
    return;
  }

  // Criando um objeto com comentário e os dados do usuário
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id
  }
  
  // Adicionando o comentário no array de comentários da foto
  photo.comments.push(userComment)

  // Salvando o comentário no array de comentários
  await photo.save();

  res.status(200).json({ comment: userComment, message: "O comentário foi adicionado com sucesso!" })

};

// Buscando uma imagem pelo título
const searchPhotos = async (req, res) => {

  // Resgatando a query passada - a string de busca
  const {q} = req.query

  // Buscando as fotos que possuem no titulo algo parecido com a string de busca
  const photos = await Photo.find({title: new RegExp(q, "i")})  

  // Retornando as fotos encontradas
  res.status(200).json(photos)
}

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos
};
