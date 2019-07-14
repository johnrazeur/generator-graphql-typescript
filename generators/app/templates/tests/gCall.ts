import { graphql, GraphQLSchema } from "graphql";
import Container from "typedi";
import * as TypeORM from "typeorm";

import { createSchema } from "../src/server/createSchema";


TypeORM.useContainer(Container);

interface Options {
    source: string;
    variableValues?: Record<string, any>;
    userId?: number;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId }: Options): Promise<Record<string, any>> => {
    if (!schema) {
        schema = await createSchema();
    }
    return graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            user: {
                id: userId
            }
        }
    });
};