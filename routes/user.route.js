import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { getUser, getUsers, updateUserProfile } from "../controllers/user.controller.js";
import User from "../models/user.model.js";

const userRouter = Router();


userRouter.get('/', getUsers);
userRouter.get("/me", authorize, async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  });
userRouter.get('/:id', authorize, getUser);
userRouter.put('/me', authorize, updateUserProfile)

export default userRouter;