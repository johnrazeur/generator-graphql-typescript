import { userResponse } from "../../utils/genericTypes";
import { Project } from "../../entities/project";

export const CreateProjectPayload = userResponse("CreateProjectPayload", Project);
