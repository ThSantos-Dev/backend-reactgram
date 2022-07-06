const { validationResult } = require("express-validator");

// Função responsável por fazer Validações de Requisição
const validate = (req, res, next) => {
  // Resgatando possíveis erros na requisição
  const errors = validationResult(req);

  // Validação para verificar se houveram erros
  if (errors.isEmpty()) return next();

  // Armazenando os erros
  const extractedErrors = [];

  // Adicioanando os erros para o Array
  errors.array().map((err) => extractedErrors.push(err.msg));

  // Retornando os erros para o Front-end
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = validate;
