import { Arg, Authorized, Ctx, Mutation, Query, Resolver, FieldResolver, Root } from "type-graphql";
import { Inject } from "typedi";
import { Context } from "../../context/context.interface";
import { Project } from "../../entities/project";
import { User } from "../../entities/user";
import { UserError } from "../../utils/genericTypes";
import { ProjectInput } from "./project.input";
import { CreateProjectPayload } from "./project.payload";
import { ProjectService } from "./project.service";
import { MyError } from "../../utils/error";

@Resolver(Project)
export class ProjectResolver {
    @Inject()
    private readonly projectService: ProjectService;

    @Authorized()
    @Query((): [typeof Project] => [Project])
    public projects(@Ctx() { user }: Context): Promise<Project[]> {
        return this.projectService.getProjectByUser(user);
    }

    @Authorized()
    @Mutation((): typeof CreateProjectPayload => CreateProjectPayload)
    public async createProject(@Arg("input") input: ProjectInput, @Ctx() { user }: Context): Promise<typeof CreateProjectPayload> {
        try {
            return await this.projectService.createProject(input.name, user);
        } catch (e) {
            if (e instanceof MyError) {
                return new UserError(e.message);
            }
        }
    }

    @FieldResolver()
    public async owner(@Root() project: Project): Promise<User> {
        return this.projectService.getOwnerByProjectId(project.id);
    }
}