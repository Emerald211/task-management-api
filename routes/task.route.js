import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const taskRouter = Router();


taskRouter.post("/create", authorize, createTask);
taskRouter.get("/", authorize, getTasks);
taskRouter.put("/edit/:id", authorize, updateTask);
taskRouter.delete("/delete/:id", authorize, deleteTask);

export default taskRouter;