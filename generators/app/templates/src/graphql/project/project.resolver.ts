import { Resolver, Query, Arg, Mutation, Ctx, Authorized } from "type-graphql";
import { Project } from "../../entities/project";
import { ProjectInput } from "./project.input";
import { Context } from "../../context/context.interface";
import { ProjectService } from "./project.service";
import { Inject } from "typedi";


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
    @Mutation((): typeof Project => Project)
    public addProject(@Arg("project") projectInput: ProjectInput, @Ctx() { user }: Context): Promise<Project> {
        return this.projectService.createProject(projectInput, user);
    }
}