import "reflect-metadata";
import { ApolloServer, ApolloError } from "apollo-server";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import * as jwt from "jsonwebtoken";
import { getConnectionOptions, createConnection } from "typeorm";
import * as dotenv from "dotenv";

import { Context } from "../context/context.interface";
import { UserInterface } from "../context/user.interface";
import { createSchema } from "./createSchema";
import { GraphQLFormattedError, GraphQLError } from "graphql";

// register 3rd party IOC container
TypeORM.useContainer(Container);

export async function bootstrap(): Promise<void> {
    try {
        const path = `${__dirname}/../../.env.${process.env.NODE_ENV}`;

        dotenv.config({ path: path });

        const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
        await createConnection({ ...connectionOptions, name: "default" });

        // build TypeGraphQL executable schema
        const schema = await createSchema();

        const context = ({ req }): Context => {
            //Get the jwt token from the header
            const authorization: string = req.headers.authorization || '';
            const authorizationSplit: string[] = authorization.split(' ');

            if (authorizationSplit[0].toLocaleLowerCase() !== "bearer") {
                return;
            }

            const token: string = authorizationSplit[1];
            let jwtPayload: string | any;

            if (!token) {
                return;
            }

            try {
                jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
                return {
                    user: jwtPayload.user as UserInterface
                };
            } catch (error) {
                return;
            }
        };

        // Create GraphQL server
        const server = new ApolloServer({
            schema,
            context,
            formatError: (error: GraphQLError): GraphQLFormattedError<Record<string, any>> => {
                if (error instanceof ApolloError) {
                    return error;
                }

                return new GraphQLError("Internal error");
            } 
        });

        // Start the server
        const { url } = await server.listen(4000);
        console.log(`Server is running, GraphQL Playground available at ${url}`);
    } catch (err) {
        console.error(err);
    }
}