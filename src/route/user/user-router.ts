import multer from "multer";
import AppRouter from "../../custom_modules/app-router";
import { editUser, getUser, signup, login } from "./user-controllers";
import { upload } from "../file/file-upload";
import { validateToken } from "../../middlewares/authorization";

const userRouter = new AppRouter("/user");

userRouter.router.post("/signup", upload.none(), signup);
userRouter.router.post("/login", upload.none(), login);
userRouter.router.get("/:user_name",validateToken, upload.none(), getUser)

// userRouter.router.get("/validate", upload.none(), loginUser);

userRouter.router.put("/update/:user_name", validateToken, upload.none(), editUser);



export default userRouter;