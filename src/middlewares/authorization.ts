
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../custom_modules/mysql_connector';

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).send({
			success: false,
			message: 'No token provided.'
		});
	}
	jwt.verify(token, config.server.token.secret, (err: any, decoded: any) => {
		if (err) {
			return res.status(500).send({
				success: false,
				message: `Failed to authenticate token. : ${err.message}}`,
				error: err
			});
		}
		console.log(`Token successfully validated.\nDecoded : `, decoded);
		res.locals.jwt = decoded;
		next();
	});
};

export const checkSpaceCreator = async (req: Request, res: Response, next: NextFunction) => {
	const { space_num } = req.params;
	const { username } = res.locals.jwt;
	
	try {
		//check mysql id space_num is created by username
	const result:any = await db.execute(`SELECT * FROM spaces_table WHERE space_num = ? AND creator = ?`, [space_num, username]);
	// If space found
	if(result.length > 0) {
		// go to next middleware
		console.log(`Creator verified : ${username} is the creator of this space ${space_num}.`);
		next();
	}
	// If space not found
	else {
		console.log(`${username} is NOT the creator of this space ${space_num}.`);
		return res.status(401).send({
			success: false,
			message: `${username} is NOT the creator of this space ${space_num}.`
		});
	}
	} catch (err:any) {
		return res.status(500).send({
			success: false,
			message: `Error occured during checkSpaceCreator middleware : ${err.message}}`,
			error: err
		});
	}
};

export const checkCommentCreator = async (req: Request, res: Response, next: NextFunction) => {
	const { comment_num } = req.params;
	const { username } = res.locals.jwt;
	console.log(comment_num, username);
	
	try {
		//check mysql id comment_num is created by username
	const result:any = await db.execute(`SELECT * FROM comment_table WHERE comment_num = ? AND username = ?`, [comment_num, username]);
	// If comment found
	if(result.length > 0) {
		// go to next middleware
		console.log(`comment creator username verified : ${username} is the creator of this comment ${comment_num}.`);
		next();
	}
	// If space not found
	else {
		console.log(`${username} is NOT the creator of this comment ${comment_num}.`);
		return res.status(401).send({
			success: false,
			message: `${username} is NOT the creator of this comment ${comment_num}.`
		});
	}
	} catch (err:any) {
		return res.status(500).send({
			success: false,
			message: `Error occured during checkCommentCreator middleware : ${err.message}}`,
			error: err
		});
	}
};