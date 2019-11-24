import { Connection } from "typeorm";

import { testConn } from "../testConn";
import { gCall } from "../gCall";
import { seedDatabase } from "../seeds";
import { User } from "../../src/entities/user";
import * as jwt from "jsonwebtoken";

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

const loginQuery = `
query Login($input: LoginInput!) {
    login(
        input: $input
    ) {
        ... on LoginType {
            __typename
            token
        }
        ... on UserError {
            __typename
            message
        }
    }
}
`;

const registerMutation = `
mutation Register($input: RegisterInput!) {
    register(
        input: $input
    ) {
        ... on User {
            __typename
            username
            email
        }
        ... on UserError {
            __typename
            message
        }
    }
}  
`;

describe("Auth", (): void => {
    it("success to register user", async (): Promise<void> => {
        const input = {
            username: "test register", 
            email:"test.register@gmail.com",
            password: "pass",
            confirmPassword: "pass"
        }
        const response = await gCall({
            source: registerMutation,
            variableValues: {
                input
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    __typename: "User",
                    username: input.username,
                    email: input.email
                }
            }
        });
    });

    it("fail to register user with same email", async (): Promise<void> => {
        const { users: { unitTestUser } } = seeds;

        const input = {
            username: "test register same email", 
            email:unitTestUser.email,
            password: "pass",
            confirmPassword: "pass"
        };

        const response = await gCall({
            source: registerMutation,
            variableValues: {
                input
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    __typename: "UserError",
                    message: "email already use",
                }
            }
        });
    });

    it("fail to register user with same username", async (): Promise<void> => {
        const { users: { unitTestUser } } = seeds;

        const input = {
            username: unitTestUser.username, 
            email: "same.username@gmail.com",
            password: "pass",
            confirmPassword: "pass"
        };

        const response = await gCall({
            source: registerMutation,
            variableValues: {
                input
            }
        });

        expect(response).toMatchObject({
            data: {
                register: {
                    __typename: "UserError",
                    message: "username already use",
                }
            }
        });
    });

    it("success to login user", async (): Promise<void> => {
        const { users: { unitTestUser } } = seeds;

        const input = {
            email: unitTestUser.email,
            password: "s3cr3tp4ssw0rd"
        }

        const response = await gCall({
            source: loginQuery,
            variableValues: {
                input
            }
        });

        const token = response.data.login.token;

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
        const { users: { unitTestUser } } = seeds;
        
        const input = {
            email: unitTestUser.email,
            password: "wrongpassword"
        }

        const response = await gCall({
            source: loginQuery,
            variableValues: {
                input
            }
        });

        expect(response.data.login).toMatchObject({
            __typename: "UserError",
            message: "invalid email or password"
        });
    });
});