import { Connection } from "typeorm";

import { testConn } from "../testConn";
import { gCall } from "../gCall";
import { seedDatabase } from "../seeds";
import { User } from "../../src/entities/user";

let connection: Connection;
let users: Record<string, User>;

beforeAll(async (done): Promise<void> => {
    connection = await testConn();
    users = await seedDatabase(connection);
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

const addProjectMutation = `
mutation  Project($project: ProjectInput!){
    addProject(
        project: $project
    ) {
        name
    }
}  
`


describe("Project", (): void => {
    it("get projects", async (): Promise<void> => {
        const { unitTestUser } = users;

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

    it("add project", async (): Promise<void> => {
        const { unitTestUser } = users;

        const name = "testProject";
        const project = {
            name
        }
        const response = await gCall({
            source: addProjectMutation,
            variableValues: {
                project
            },
            userId: unitTestUser.id
        });

        expect(response).toMatchObject({
            data: {
                addProject: {
                    name
                }
            }
        });
    });

    it("get empty projects", async (): Promise<void> => {
        const { emptyUser } = users;

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