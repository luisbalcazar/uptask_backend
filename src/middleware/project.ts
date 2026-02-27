import type { Request, Response, NextFunction } from "express";
import ProjectService from "../services/ProjectService";
import { IProject } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

export const projectExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { projectId } = req.params;
  try {
    const projectResponse = await ProjectService.getProjectById(projectId);

    if (!projectResponse) {
      const error = new Error("No se ha encontrado el proyecto");
      return res.status(404).json({ error: error.message });
    }

    req.project = projectResponse;

    next();
  } catch (error) {
    res.status(400).json({ error: "Hubo un error: " + error });
  }
};
