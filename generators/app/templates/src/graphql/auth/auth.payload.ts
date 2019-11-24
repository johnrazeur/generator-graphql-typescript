
import { ObjectType, Field } from "type-graphql";
import { User } from "../../entities/user";
import { userResponse } from "../../utils/genericTypes";

@ObjectType()
export class LoginType {
    @Field()
    public token: string;
}

export const LoginPayload = userResponse("LoginPayload", LoginType);
export const RegisterPayload = userResponse("RegisterPayload", User);