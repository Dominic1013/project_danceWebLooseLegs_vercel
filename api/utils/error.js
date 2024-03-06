// 這是一個自定義的error function, 用來處理不是伺服器的error, 例如：password密碼不夠長等等

// 伺服器錯誤本身已經有try...catch(err)去產生了，不需要自定義error，但是其他不是伺服器的我們需要自己做一個。

export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
