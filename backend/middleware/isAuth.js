import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ msg: "user don't have token" });
    }

    let verifyToken = await jwt.verify(token, process.env.JWT_TOKEN);

    if (!verifyToken) {
      return res.status(400).json({ msg: "user don't have valid token" });
    }

    req.userID = verifyToken.userID;
    next();
  } catch (error) {
    return res.status(500).json({ msg: `isAuth error ${error}` });
  }
};


export default isAuth
