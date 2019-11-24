import { Field, ObjectType, createUnionType } from "type-graphql";

@ObjectType()
export class UserError {
    public constructor(message: string) {
        this.message = message;
    }

    @Field()
    public message: string;
}

export function userResponse(name: string, objectType: any): any {
    return createUnionType({
        name,
        types: () => [objectType, UserError]
    });
}
