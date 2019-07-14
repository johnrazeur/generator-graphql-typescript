import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../graphql/auth/user.service";
import { Container } from "typedi";
import { User } from "../entities/user";


@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    private readonly userService: UserService = Container.get(UserService);

    public async validate(email: any): Promise<boolean> {
        const user: User = await this.userService.getUserByEmail(email);

        if (user) {
            return false;
        }
        return true;
    }

}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions): Function {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint
        });
    };
}