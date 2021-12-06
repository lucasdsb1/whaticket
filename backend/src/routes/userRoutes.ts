import { Router } from "express";

import isAuth from "../middleware/isAuth";
import * as UserController from "../controllers/UserController";

const userRoutes = Router();

userRoutes.get("/users", isAuth, UserController.index);

userRoutes.post("/users", isAuth, UserController.store);

userRoutes.put("/users/:userId", isAuth, UserController.update);

userRoutes.put("/users/pass/:userId", isAuth, UserController.updatePassword);

userRoutes.get("/users/:userId", isAuth, UserController.show);

userRoutes.delete("/users/:userId", isAuth, UserController.remove);

export default userRoutes;
