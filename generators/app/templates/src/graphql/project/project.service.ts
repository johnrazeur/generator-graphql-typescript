import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserInterface } from "../../context/user.interface";
import { Project } from "../../entities/project";
import { ProjectSameNameError } from "./project.error";
import { User } from "../../entities/user";

@Service()
export class ProjectService {
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>

    public async getOwnerByProjectId(projectId: number): Promise<User> {
        return this.projectRepository.createQueryBuilder()
            .select([
                "owner.*"
            ])
            .relation(Project, "owner")
            .of(projectId)
            .loadOne();
    }

    public async getProjectByUser(user: UserInterface): Promise<Project[]> {
        return this.projectRepository.find({ owner: user });
    }

    public async checkProjectExists(name: string, user: UserInterface): Promise<boolean> {
        return await this.projectRepository.findOne({
            name,
            owner: { id: user.id }
        }) !== undefined;
    }

    public async createProject(name: string, user: UserInterface): Promise<Project> {
        if (await this.checkProjectExists(name, user)) {
            throw new ProjectSameNameError(name);
        }

        const project = this.projectRepository.create({
            name,
            owner: user,
        });
        return this.projectRepository.save(project);
    }
}