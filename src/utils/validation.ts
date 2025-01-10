export const isEmailValid = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
  
export const isPasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};
  