import validator from "validator";
import User from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import gentoken from "../config/token.js";
import sendMail from "../config/sendMail.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ msg: "user allredy exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "enter valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ msg: "Enter Strong Password" });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    let token = await gentoken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ msg: `SignUp Error ${err}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        msg: "incorrect Password",
      });
    }

    let token = await gentoken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ msg: `Login Error ${err}` });
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ msg: `Logout Succesfully` });
  } catch (error) {
    return res.status(500).json({ msg: `Logout Error ${err}` });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ msg: "OTP send Succesfully" });
  } catch (error) {
    return res.status(500).json({ msg: `Send OTP Error ${error}` });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(404).json({ msg: "Invalid OTP" });
    }

    user.resetOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;

    await user.save();

    return res.status(200).json({ msg: "verified OTP Succesfully" });
  } catch (error) {
    return res.status(500).json({ msg: `Send OTP Error ${err}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isOtpVerified == false) {
      return res.status(404).json({ msg: "OTP verification required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ msg: "Password reset Succesfully" });
  } catch (error) {
    return res.status(500).json({ msg: `Reset Password Error ${error}` });
  }
};


export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      user = await User.create({
        name,
        email,
        role,
      })
    }
    let token = await gentoken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ msg: `Google Auth Error ${error}` });
  }
};