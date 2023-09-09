import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const downloadFile = (req: Request, res: Response) => {
	const folder = req.params.folder;
			const file = req.params.file;
			const filePath = path.join(__dirname, folder, file);
			console.log(filePath);
		
			fs.access(filePath, fs.constants.F_OK, (err) => {
				if (err) {
					res.status(404).send('File not found');
				} else {
					res.download(filePath, (err) => {
						if (err) {
							res.status(500).send('Error downloading file');
						}
					});
				}
			});
}

export const deleteFile = (fileName:string, folderName:string) => {
	// Delete the prev file in space_image folder
	fs.unlink(`${__dirname}/${folderName}/${fileName}`, (err) => {
		if (err) {
			console.log(`Error occured while attempting to delete file in the following path : ${folderName}${fileName}\nError : `, err);

		} else {
			//check if space_image deleted successfully
			fs.access(`${__dirname}/${folderName}/${fileName}`, fs.constants.F_OK, (err) => {
				if (err) {
					console.log(`${fileName} : successfully deleted!`);
				} else {
					console.log(`${fileName} is still in space_image folder`);
				}
			});
		}
	});
}