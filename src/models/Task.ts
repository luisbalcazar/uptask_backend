import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const; //colocamos esto cuando queremos que todas las propiedades del objeto sean tipo readonly (no se puedan modificar)

export const taskStatusEnum = Object.values(taskStatus);

export type TaskStatusType = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatusType;
}

const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Types.ObjectId,
      required: true,
      ref: "Project",
    },
    status: {
      type: String,
      enum: Object.values(taskStatus), //Le decimos que solo pueded aceptar alguno de los valores de taskStatus unicamente
      default: taskStatus.PENDING,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
