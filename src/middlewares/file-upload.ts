import { Request } from "express";
import multer from "multer";

export const imageFolderName = "images";

const imageDest = (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
	callback(null, `${__dirname}/${imageFolderName}/`);
}
const spaceFileDest = (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
	callback(null, `${__dirname}/space_files/`);
}

const fileName = (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
	let [filename, extension] = file.originalname.split('.');
			let nameFile = filename + "-" + Date.now() + "." + extension; // --> give "video-1622181268053.mp4"
			callback(null, nameFile);
}

const imageStorage:multer.StorageEngine = multer.diskStorage({
	destination: imageDest, // where to store
	filename: fileName // 
	}
);

const spaceFileStorage:multer.StorageEngine = multer.diskStorage({
	destination: spaceFileDest, // where to store
	filename: fileName // 
	}
);

const upload = multer();