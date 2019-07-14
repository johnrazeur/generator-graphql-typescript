import { InputType, Field } from "type-graphql";
import { SameValue } from "../../validators/sameValue";
import { IsUserAlreadyExist } from "../../validators/isUserAlreadyExist";
import { IsEmail } from "class-validator";

@InputType()
export class RegisterInput {
    @Field()
    public username: string;

    @Field()
    @SameValue('confirmPassword', {
        message: "Passwords are not the same."
    })
    public password: string;

    @Field()
    @IsEmail()
    @IsUserAlreadyExist({
        message: "Email $value is already use. Choose another email."
    })
    public email: string;

    @Field()
    public confirmPassword: string;
}
