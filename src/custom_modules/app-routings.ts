import { Router, Express } from "express";

import AppRouter from "./app-router";

import userRouter from "../route/user/user-router";
import chatbotRouter from "../route/chatbot/chatbot-router";

export class AppRouting {
	private app: Express;
  constructor(appArg:Express) {
		this.app= appArg;
    this.setRoutes();
  }
  public setRoutes() {
    // Add the routing classes.
		this.addRoute(userRouter);
		this.addRoute(chatbotRouter);
  }

  private addRoute(appRouter: AppRouter) {
    this.app.use(appRouter.route, appRouter.router);
  }
}
