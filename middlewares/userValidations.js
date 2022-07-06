// Validações do Registro e Login de usuário

// Me entrega tudo que vem na requisição
const { body } = require("express-validator");

// Função para validação da criação do usuário
const userCreateValidation = () => {
    // Criando as validações com o express-validator! 
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),

    body("email")
        .isString()
        .withMessage("O email é obrigatório.")
        .isEmail()
        .withMessage("Insira um e-amil válido."),

    body("password")
        .isString()
        .withMessage("A senha é obrigatória.")
        .isLength({min: 5})
        .withMessage("A senha precisa ter no mínimo 5 caracteres."),

    body("confirmPassword")
        .isString()
        .withMessage("A confimação de senha é obrigatória.")
        .custom((value, {req}) => {
            if(value != req.body.password){
                throw new Error("As senhas não são iguais!")
            }

            return true
        })
  ];
};


// Função para validação de login
const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O email é obrigatório.")
            .isEmail()
            .withMessage("Insira um email válido."),
        
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
    ]
}

// Função para validação de atualização de usuário
const userUpdateValidation = () => {

    return [
        body("name")
            .optional()
            .isLength({min: 3})
            .withMessage("O nome precisa conter pelo menos 3 caracteres"),

        body("password")
            .optional()
            .isLength({min: 5})
            .withMessage("A senha precisa ter no mínimo 5 caracteres,"),
    ]

}


module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation
};
