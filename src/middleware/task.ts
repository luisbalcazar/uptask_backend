import type { Request, Response, NextFunction } from "express";
import { ITask } from "../models/Task";
import TaskService from "../services/TaskService";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export const taskExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { taskId } = req.params;
  try {
    const taskResponse = await TaskService.getTaskById(taskId);

    if (!taskResponse) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ error: error.message });
    }

    req.task = taskResponse;

    next();
  } catch (error) {
    res.status(400).json({ error: "Ha ocurrido un error: " + error });
  }
};

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.task.project._id.toString() !== req.project._id.toString()) {
    const error = new Error("Acción no valida");
    return res.status(400).json({ error: error.message });
  }
  next();
};
