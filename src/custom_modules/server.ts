import express from "express";
import { AppRouting } from "./app-routings";
import multer from "multer";
import config from "../config/config";

class Server {
	private app: express.Express;
	private upload: multer.Multer;
	private port: string | number;

	constructor() {
		//set the express app
		this.app = express();
		this.upload = multer();
		this.port = config.server.port || 3000;//set the port

		//set the middlewares
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));

		//set the routes
		new AppRouting(this.app)

		//error handler
	}
	
	public start() {
		this.app.listen(this.port, () => {
			console.log("**-------------------------------------------------**");
			console.log("====          Chatbot Server is On...!!!         ====");
			console.log(`====       URL : http://${config.server.hostname}:${this.port}       ====`);
			console.log("**-------------------------------------------------**");
		});
	}

	// public stop() {
	// 	this.server.
	// 	this.server.close(() => {
	// 			console.log(`Server stopped listening on port ${this.port}`);
	// 	});
	// }
}
export default Server;