import validator from "validator";

// Função para validar email
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

// Função para validar senha (mínimo 4 caracteres para compatibilidade)
export const validatePassword = (password: string): boolean => {
  return password.length >= 4;
};

// Função para validar entrada de usuário
export const validateUserInput = (
  email: string | undefined,
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (email && !validateEmail(email)) {
    errors.push("Email inválido");
  }

  if (!validatePassword(password)) {
    errors.push("Senha deve ter pelo menos 4 caracteres");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
