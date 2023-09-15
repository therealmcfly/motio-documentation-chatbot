import multer from "multer";
import AppRouter from "../../custom_modules/app-router";
import { upload } from "../file/file-upload";
import { validateToken } from "../../middlewares/authorization";

const chatbotRouter = new AppRouter("/chatbot");
chatbotRouter.router.get("/", (req, res) => {
	//open page that shows text "Chatbot"
	console.log("Chatbot route called");
	res.send("Chatbot");
});

export default chatbotRouter;