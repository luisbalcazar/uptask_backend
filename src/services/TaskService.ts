import type { Types } from "mongoose";
import Task, { ITask } from "../models/Task";

class TaskService {
  static createTask = (task: ITask) => {
    return new Task(task);
  };

  static getProjectTasks = (projectID: Types.ObjectId) => {
    return Task.find({
      project: projectID,
    }).populate("project");
  };

  static getTaskById = (id: Types.ObjectId) => {
    return Task.findById(id).populate("project");
  };

  static deleteTask = (task: ITask) => {
    return task.deleteOne();
  };
}

export default TaskService;
