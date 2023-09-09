import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../../custom_modules/mysql_connector";
import { IUser } from "./user-model";
import { toMysqlDateTime } from "../../utils/date";

import jwt from "jsonwebtoken";
import config from "../../config/config";

const generateToken = (user:IUser, callback:(error:Error | null, token:string | null) => void) => {
	var timeSinceEpoch = new Date().getTime();
	var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
	var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

	console.log(`Attempting to generate token for ${user.user_email}`);

	try {
		jwt.sign(
			{
				email: user.user_email,
				username: user.username,
			},
			config.server.token.secret,
			{
				algorithm: "HS256",
				expiresIn: expirationTimeInSeconds,
				issuer: config.server.token.issuer,
			},
			(error, token) => {
				if (error) {
					callback(error, null);
				} else if (token) {
					callback(null, token);
				}
			}
		);
	} catch (error:any) {
		console.log('generateToken error : ', error.message, error);
		callback(error, null);
	}
}

export const signup = async (req: Request, res: Response) => {
	// Get submitted user data from request body
  const userData: IUser = req.body;
	// Get password from user data and hash it
  const { password } = userData;
  try {
		// Hash password
    const hash = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
    userData.password = hash;
		// Set updated_at to current time
    userData.updated_at = toMysqlDateTime(new Date());
		// Insert user data into database
    const result:any = await db.execute(`INSERT INTO users_table SET ?`, [userData]);

    console.log(`User successfully registered!\nresult : `,result,"\ndata :", userData);
    return res.status(200).send({
      success: true,
      message: "User successfully registered!",
      data: userData,
			result: result
    });
  } catch (err) {
    console.log(`Error occurred while registering user\nError : `, err);
    return res.status(500).send({
      success: false,
      message: "Error occurred while registering user",
      error: err,
    });
  }
};


export const login = async (req: Request, res: Response) => {
	const { user_email, password } = req.body;
	try {
		// Get user from database
		const result:any = await db.execute(`SELECT * FROM users_table WHERE user_email = ?`, [user_email]);
		const userData = result[0];
		// If user found
		if (userData) {
			// Compare password with hashed password
			const passwordCheck = await new Promise<boolean>((resolve, reject) => {
				// Compare password with hashed password
				bcrypt.compare(password, userData.password, (err, match) => {
					if (err) {
						reject(err);
					} else {
						resolve(match);
					}
				});
			});
			// If password matches
			if (passwordCheck) {
				// Generate token
				const token = generateToken(userData, (error, token) => {
					// If error generating token
					if(error){
						console.log(`Unable to generate token.\nError : `, error);
						return res.status(401).send({
							success: false,
							message: "Unable to generate token",
							error: error,
						});
					} 
					// If token generated successfully
					else {
						// Remove password from user data
						delete userData.password;
						// Send token and user data
						console.log(`Authorization successful!\ndata : `, userData);
						return res.status(200).send({
							success: true,
							message: "Authorization successful!",
							token: token,
							data: userData,
						});
					}
				});
			} 
			// If password doesn't match
			else {
				console.log(`Incorrect password!`);
				return res.status(401).send({
					success: false,
					message: "Incorrect password!"
				});
			}
		} 
		// If user not found
		else {
			console.log(`No user found with the submitted email : ${user_email}`);
			return res.status(404).send({
				success: false,
				message: `No user found with the submitted email : ${user_email}`
			});
		}
	} catch (err:any) {
		console.log(`Error occurred while logging in user\nError : `, err);
		return res.status(500).send({
			success: false,
			message: "Error occurred while logging in user",
			error: err.message,
		});
	}

};


export const getUser = async (req: Request, res: Response) => {
	console.log(res.locals.jwt.username)
	const {username} = res.locals.jwt;
	const {user_name} = req.params;
	if (username !== user_name) {
		return res.status(401).send({
			success: false,
			message: "Unauthorized access"
		});
	}
	else {
		try {
			// Get user from database
			const result:any = await db.execute(`SELECT * FROM users_table WHERE username = ?`, [username]);
			const userData = result[0];
			// If user found
			if (userData) {
				// Remove password from user data
				delete userData.password;
				// Send user data
				console.log(`User found!\ndata : `, userData);
				return res.status(200).send({
					success: true,
					message: "User found!",
					data: userData,
				});
			} 
			// If user not found
			else {
				console.log(`No user found with the submitted username : ${username}`);
				return res.status(404).send({
					success: false,
					message: `No user found with the submitted username : ${username}`
				});
			}
		} catch (err:any) {
			console.log(`Error occurred while getting user\nError : `, err);
			return res.status(500).send({
				success: false,
				message: `Error occurred while getting user\nError : ${err.message}`,
			});
	
		}
	}
}

//need to edit
export const editUser = async (req: Request, res: Response) => {
	
};
