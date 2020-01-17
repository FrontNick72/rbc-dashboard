export const validateEmail = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string) => {
  const isLatinWord = /^[a-zA-Z0-9]+$/.test(password);
  const isCountPassword = password.length >= 8;

  return {
    isLatinWord,
    isCountPassword,
  };
};

export const validatePhone = (phone: string) => {
  const re = /^(\+?7|8)?9\d{9}$/;
  return re.test(phone);
};

export const validateSymbol = (value: string) => {
  const re = /[^A-Яа-яA-Za-z0-9 \-]+/;
  return re.test(value);
};
