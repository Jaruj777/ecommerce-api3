import { getTokenFromHeader } from "../utils/getTokenFromheadr.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  // vrify the token
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    throw new Error("Invalid/Expired token, please login again");
  } else {
    //save the user into req obj после проверки сохраним пользователя в обєкте запроса
    req.userAuthId = decodedUser?.id;
    next();
  }
};
