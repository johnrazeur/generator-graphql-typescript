import { MyError } from "../../utils/error";

export class ProjectSameNameError extends MyError {
    constructor(projectName: string) {
        const message = `project ${projectName} already exists`;
        super(message);
    }
}