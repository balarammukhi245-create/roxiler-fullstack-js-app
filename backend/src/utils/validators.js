export const isValidName = (name) => {
  return name.length >= 10 && name.length <= 60;
};

export const isValidAddress = (address = "") => {
  return address.length <= 400;
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
  return regex.test(password);
};
