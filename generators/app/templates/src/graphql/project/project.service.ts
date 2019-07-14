import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Project } from "../../entities/project";
import { Repository } from "typeorm";
import { UserInterface } from "../../context/user.interface";
import { ProjectInput } from "./project.input";

@Service()
export class ProjectService {
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>

    public async getProjectByUser(user: UserInterface): Promise<Project[]> {
        return this.projectRepository.find({ owner: user });
    }

    public async createProject(projectInput: ProjectInput, user: UserInterface): Promise<Project> {
        const project = this.projectRepository.create({
            ...projectInput,
            owner: user,
        });
        return this.projectRepository.save(project);
    }
}