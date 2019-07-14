import { Connection } from "typeorm";

import { testConn } from "../testConn";
import { gCall } from "../gCall";
import { seedDatabase } from "../seeds";
import { User } from "../../src/entities/user";
import * as jwt from "jsonwebtoken";

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

const loginQuery = `
query Login($user: LoginInput!) {
    login(
        login: $user
    )
}
`;

const registerMutation = `
mutation Register($register: RegisterInput!) {
    register(
        user: $register
    ) {
        username
        email
    }
}  
`


describe("Auth", (): void => {
    it("register user", async (): Promise<void> => {
        const register = {
            username: "test register", 
            email:"test.register@gmail.com",
            password: "pass",
            confirmPassword: "pass"
        }
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                register
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    username: register.username,
                    email: register.email
                }
            }
        });
    });

    it("login user", async (): Promise<void> => {
        const { unitTestUser } = users;

        const user = {
            email: unitTestUser.email,
            password: "s3cr3tp4ssw0rd"
        }

        const response = await gCall({
            source: loginQuery,
            variableValues: {
                user
            }
        });

        const token = response.data.login;

        expect(token).not.toBeNull();

        expect((): void => {
            jwt.verify(token, process.env.JWT_SECRET);
        }).not.toThrow();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        expect(decoded.user).toMatchObject({
            id: unitTestUser.id,
            username: unitTestUser.username,
            email: unitTestUser.email
        });
    });

    it("fail to login user", async (): Promise<void> => {
        const { unitTestUser } = users;
        
        const user = {
            email: unitTestUser.email,
            password: "wrongpassword"
        }

        const response = await gCall({
            source: loginQuery,
            variableValues: {
                user
            }
        });

        expect(response.data).toBeNull();
        const error = response.errors[0];

        expect(error.extensions.code).toEqual("UNAUTHENTICATED");
        expect(error.message).toEqual("invalid login or password");
    });
});