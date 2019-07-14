import { Container } from "typedi";
import { buildSchema } from "type-graphql";

import { authChecker } from '../context/authChecker';



export async function createSchema(): Promise<any> {
    // build TypeGraphQL executable schema
    return buildSchema({
        resolvers: [__dirname + "/../graphql/**/*.resolver.ts"],
        container: Container,
        authChecker
    });
}