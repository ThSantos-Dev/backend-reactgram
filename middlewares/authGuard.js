// Importando a model
const User = require("../models/User");

// Importando o JWT
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_PASS || "13AMOaMEL05";

// Função para verificar se o usuário está autenticado
const authGuard = async (req, res, next) => {
  // Resgatando a sessão de authorization dos headers
  const authHeader = req.headers["authorization"];

  // Resgatando o valor do token no cabeçalho da requisição
  const token = authHeader && authHeader.split(" ")[1]; // Bearer ewne3eb2hb2hbwsudb92

  // Validação para verificar se o token está presente no cabeçalho
  if (!token) return res.status(401).json({ errors: ["Acesso negado!"] });

  // Validação para verificar se o token é válido
  try {
    // Validação para verificar se o token é válido pelo método do JWT
    const verified = jwt.verify(token, jwtSecret);

    // Resgatando os dados do usuário e encapsulando na req para que no next possa ser passado adiante
    // O select("-password") diz que quer tudo do usuário MENOS a SENHA
    req.user = await User.findById(verified.id).select("-password");

    // Chamando a próxima função
    next();
  } catch (error) {
    // Retornando uma mensagem de erro para o front
    res.status(401).json({ errors: ["Token inválido"] });
  }
};

module.exports = authGuard;
