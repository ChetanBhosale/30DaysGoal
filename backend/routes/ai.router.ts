import { Router } from "express";
import isAuthenticated from "../middleware/authentication";

import {
  askQuestions,
  getPlan,
  getUserGoals,
  setUserGoal,
} from "../controller/ai.controller";
const aiRouter = Router();

aiRouter.post("/goal", isAuthenticated, setUserGoal);
aiRouter.get("/goal", isAuthenticated, getUserGoals);
aiRouter.post("/goal/chat-questions/:id", isAuthenticated, askQuestions);
aiRouter.get("/goal-plan/:id", isAuthenticated, getPlan);

export default aiRouter;
