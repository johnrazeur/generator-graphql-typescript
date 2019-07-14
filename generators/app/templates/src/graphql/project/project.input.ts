import { InputType, Field } from "type-graphql";

@InputType()
export class ProjectInput {
    @Field()
    public name: string;
}
