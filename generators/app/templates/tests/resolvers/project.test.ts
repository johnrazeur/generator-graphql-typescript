import { Connection } from "typeorm";

import { testConn } from "../testConn";
import { gCall } from "../gCall";
import { seedDatabase } from "../seeds";
import { User } from "../../src/entities/user";

let connection: Connection;
let seeds: Record<string, any>;

beforeAll(async (done): Promise<void> => {
    connection = await testConn();
    seeds = await seedDatabase(connection);
    done();
});

afterAll(async (done): Promise<void> => {
    await connection.close();
    done();
});

const projectsQuery = `
{
    projects { 
        name,
        owner { email }
    }
}
`;

const createProjectMutation = `
mutation Project($input: ProjectInput!){
    createProject(
        input: $input
    ) {
        __typename
        ... on Project {
            name
        }
        ... on UserError {
            message
        }
    }
}  
`


describe("Project", (): void => {
    it("success to get projects", async (): Promise<void> => {
        const { users: { unitTestUser } } = seeds;

        const response = await gCall({
            source: projectsQuery,
            userId: unitTestUser.id
        });

        expect(response).toMatchObject({
            data: {
                projects: [
                    {
                        name: "Project 1",
                    },
                    {
                        name: "Project 2",
                    },
                    {
                        name: "Project 3",
                    },
                ]
            }
        });
    });

    it("success to create project", async (): Promise<void> => {
        const { users: { unitTestUser } } = seeds;

        const name = "testProject";
        const input = {
            name
        }
        const response = await gCall({
            source: createProjectMutation,
            variableValues: {
                input
            },
            userId: unitTestUser.id
        });

        expect(response).toMatchObject({
            data: {
                createProject: {
                    __typename: "Project",
                    name
                }
            }
        });
    });

    it("fail to create project with same name", async (): Promise<void> => {
        const { users: { unitTestUser }, projects } = seeds;
        const project = projects[0];

        const input = {
            name: project.name
        };
        
        const response = await gCall({
            source: createProjectMutation,
            variableValues: {
                input
            },
            userId: unitTestUser.id
        });

        expect(response).toMatchObject({
            data: {
                createProject: {
                    __typename: "UserError",
                    message: `project ${project.name} already exists`
                }
            }
        });
    });

    it("success to get empty projects", async (): Promise<void> => {
        const { users: { emptyUser } } = seeds;

        const response = await gCall({
            source: projectsQuery,
            userId: emptyUser.id
        });

        expect(response).toMatchObject({
            data: {
                projects: []
            }
        });
    });
});