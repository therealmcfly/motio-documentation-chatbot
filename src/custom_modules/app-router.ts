import { Router, Request, Response, NextFunction } from "express";

export default class AppRouter {
	public route: string;
	public router: Router;
	constructor(route: string) {
		this.route = route;
		this.router = Router();
	}
}