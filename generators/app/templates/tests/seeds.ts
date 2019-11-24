import { Connection } from "typeorm";

import { User } from "../src/entities/user";
import { Project } from "../src/entities/project";


export async function seedDatabase(connection: Connection): Promise<Record<string, any>> {
    const userRepository = connection.getRepository(User);
    const projectRepository = connection.getRepository(Project);

    const unitTestUser = userRepository.create({
        email: "test@github.com",
        username: "unit test",
        password: "$2a$08$fRl6sseQ6RiUiADGIcvglelcvXDY3zLswWNPY2wqMRl8qXavcmsy2", // s3cr3tp4ssw0rd
    });
    await userRepository.save(unitTestUser);

    const emptyUser = userRepository.create({
        email: "empty@github.com",
        username: "empty user",
        password: "$2a$08$fRl6sseQ6RiUiADGIcvglelcvXDY3zLswWNPY2wqMRl8qXavcmsy2", // s3cr3tp4ssw0rd
    });
    await userRepository.save(emptyUser);

    const projects = projectRepository.create([
        { name: "Project 1", owner: unitTestUser },
        { name: "Project 2", owner: unitTestUser },
        { name: "Project 3", owner: unitTestUser },
    ]);

    await projectRepository.save(projects);

    let users: Record<string, User> = {
        unitTestUser,
        emptyUser
    }
    
    return { 
        users,
        projects
    };
}