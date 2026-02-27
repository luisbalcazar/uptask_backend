import { Request, Response } from "express";
import ProjectService from "../services/ProjectService";
import colors from "colors";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    try {
      const response = await ProjectService.createProject(req.body);

      if (!response) {
        const error = new Error("El proyecto no pudo ser creado");
        return res.status(500).json({ error: error.message });
      }

      response.save();
      res.status(201).send("Proyecto creado correctamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del proyecto: ${error.message}`,
        ),
      );
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const response = await ProjectService.getAllProjects();

      if (!response) {
        const error = new Error(
          "Ha ocurrido un error al consultar los proyectos.",
        );
        return res.status(404).json({ error: error.message });
      }

      res.json(response);
    } catch (error) {
      console.error(colors.red(error));
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await ProjectService.getProjectById(id);

      if (!response) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      res.json(response);
    } catch (error) {
      console.error(colors.red(error));
    }
  };

  static updateProyect = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const response = await ProjectService.getProjectById(id);

      if (!response) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      response.projectName = req.body.projectName;
      response.clientName = req.body.clientName;
      response.description = req.body.description;

      await response.save();
      res.send("Proyecto actualizado correctamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la actualizacion del proyecto: ${error.message}`,
        ),
      );
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      const response = await ProjectService.deleteProyect(project);

      if (!response) {
        const error = new Error("Proyecto no pudo ser eliminado");
        return res.status(404).json({ error: error.message });
      }

      res.send("Proyecto Eliminado correctamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la eliminacion del proyecto: ${error.message}`,
        ),
      );
    }
  };
}
