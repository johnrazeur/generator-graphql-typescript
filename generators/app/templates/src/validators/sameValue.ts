import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from "class-validator";


@ValidatorConstraint()
export class SameValueConstraint implements ValidatorConstraintInterface {
    public validate(value: any, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return typeof value === "string" &&
            typeof relatedValue === "string" &&
            value.length === relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
    }

}

export function SameValue(property: string, validationOptions?: ValidationOptions): Function {
    return function (object: Record<string, any>, propertyName: string): void {
        registerDecorator({
            name: "sameValue",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: SameValueConstraint
        });
    };
}