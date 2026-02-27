import Project, { IProject } from "../models/Project";

class ProjectService {
  static createProject = (project: IProject) => {
    return new Project(project);
  };

  static getAllProjects = () => {
    return Project.find({});
  };

  static getProjectById = (id: any) => {
    return Project.findById(id).populate("tasks");
  };

  static updateProyect = (id: any, project: IProject) => {
    return Project.findByIdAndUpdate(id, project);
  };

  static deleteProyect = (project: IProject) => {
    return project.deleteOne(); //Project.findByIdAndDelete(id);
  };
}

export default ProjectService;
