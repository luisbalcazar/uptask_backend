import { Request, Response } from "express";
import colors from "colors";
import TaskService from "../services/TaskService";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const response = await TaskService.createTask(req.body);
      response.project = req.project._id;

      req.project.tasks.push(response._id);

      await Promise.allSettled([response.save(), req.project.save()]);
      res.status(201).send("Tarea creada correctamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la creación del proyecto: ${error.message}`,
        ),
      );
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const response = await TaskService.getProjectTasks(req.project._id);

      if (!response) {
        const error = new Error(
          "Ha ocurrido un error al consultar las tareas.",
        );
        return res.status(404).json({ error: error.message });
      }

      res.json(response);
    } catch (error) {
      console.error(colors.red(error));
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task);
    } catch (error) {
      console.error(colors.red(error));
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();
      res.status(200).send("Tarea actualizada correctamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la actualización de la tarea: ${error.message}`,
        ),
      );
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      const response = await TaskService.deleteTask(req.task);

      if (!response) {
        const error = new Error("Tarea no pudo ser eliminada");
        return res.status(500).json({ error: error.message });
      }

      req.project.tasks = req.project.tasks.filter(
        (task) => task._id.toString() !== req.task._id.toString(),
      );

      await req.project.save();
      res.status(200).send("Tarea eliminada exitosamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la eliminación de la tarea: ${error.message}`,
        ),
      );
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    const { status } = req.body;

    try {
      req.task.status = status;

      await req.task.save();
      res.status(200).send("Status actualizado exitosamente");
    } catch (error) {
      console.error(
        colors.red(
          `Ha ocurrido un error en la actualización del status de la tarea: ${error.message}`,
        ),
      );
    }
  };
}
