import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskStatusEnum } from "../models/Task";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router();

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  ProjectController.createProject,
);

router.get("/", ProjectController.getAllProjects);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.getProjectById,
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  ProjectController.updateProyect,
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.deleteProject,
);

/* Routes for tasks */

//Tasks middlewares
router.param("projectId", projectExists);
router.param("taskId", taskExists, taskBelongsToProject);
router.param("taskId", taskBelongsToProject);

router.post(
  "/:projectId/task",
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.createTask,
);

router.get("/:projectId/task", TaskController.getProjectTasks);

router.get(
  "/:projectId/task/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.getTaskById,
);

router.put(
  "/:projectId/task/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrors,
  TaskController.updateTask,
);

router.delete(
  "/:projectId/task/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.deleteTask,
);

router.patch(
  "/:projectId/task/:taskId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status")
    .notEmpty()
    .withMessage("El status no puede estar vacío.")
    .isIn(Object.values(taskStatusEnum))
    .withMessage(
      `Estado inválido. Los estados válidos son: ${Object.values(taskStatusEnum).join(", ")}.`,
    ),
  handleInputErrors,
  TaskController.updateStatus,
);

export default router;
