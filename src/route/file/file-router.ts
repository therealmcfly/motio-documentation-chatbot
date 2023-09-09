import multer from "multer";
import AppRouter from "../../classes/app-router";
import { downloadFile } from "./file-controller";

const fileRouter = new AppRouter("/file");

fileRouter.router.get("/:folder/:file", multer().none(), downloadFile);

export default fileRouter;
