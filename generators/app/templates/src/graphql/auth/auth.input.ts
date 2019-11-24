import { InputType, Field } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class LoginInput {
    @Field()
    @IsEmail()
    public email: string;

    @Field()
    public password: string;
}

@InputType()
export class RegisterInput {
    @Field()
    public username: string;

    @Field()
    public password: string;

    @Field()
    @IsEmail()
    public email: string;

    @Field()
    public confirmPassword: string;
}
