import validator from "validator";

// Valida um email usando a biblioteca validator
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Validação simples de senha (mínimo 6 caracteres)
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Valida combinações de entrada para endpoints de usuário (ex: login/registro)
// Retorna um objeto com isValid e lista de mensagens de erro legíveis.
export const validateUserInput = (
  email: string,
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateEmail(email)) {
    errors.push("Email inválido");
  }

  if (!validatePassword(password)) {
    errors.push("Senha deve ter pelo menos 6 caracteres");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
