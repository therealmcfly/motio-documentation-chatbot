import { Request } from "express";
import multer from "multer";

const fileDest = (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
	const fieldname = file.fieldname;
	callback(null, `${__dirname}/${fieldname}/`);
}

const fileName = (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
	let [filename, extension] = file.originalname.split('.');
			let nameFile = filename + "-" + Date.now() + "." + extension; // --> give "video-1622181268053.mp4"
			callback(null, nameFile);
}

const fileStorage:multer.StorageEngine = multer.diskStorage({
	destination: fileDest, // where to store
	filename: fileName // 
	}
);

export const upload = multer({ storage: fileStorage });