
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

const MYSQL_HOST = process.env.MY_SQL_DB_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MY_SQL_DB_NAME || 'smartlight-db';
const MYSQL_USER = process.env.MY_SQL_DB_USER || 'smartlight-server';
const MYSQL_PASSWORD = process.env.MY_SQL_DB_PASSWORD || 'server-password';

const MYSQL = {
	host: MYSQL_HOST,
	database: MYSQL_DATABASE,
	user: MYSQL_USER,
	password: MYSQL_PASSWORD
}

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'motio';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKER_ISSUER || 'superencryptedsecretoftherealmcfly';


const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
	token: {
		expireTime: SERVER_TOKEN_EXPIRETIME,
		issuer: SERVER_TOKEN_ISSUER,
		secret: SERVER_TOKEN_SECRET,
	}
}

const config = { 
	mysql: MYSQL,
	openai_key: OPENAI_API_KEY,
	hf_access_token: HF_ACCESS_TOKEN,
	server: SERVER
 }


export default config;