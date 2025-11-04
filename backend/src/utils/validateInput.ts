import validator from "validator";

// Função para validar email
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Função para validar senha (mínimo 6 caracteres)
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Função para validar entrada de usuário
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
