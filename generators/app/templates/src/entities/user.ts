import { Field, ID, ObjectType } from "type-graphql";
import { PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

import { UserInterface } from "../context/user.interface";
import * as bcrypt from "bcryptjs";

@ObjectType()
@Entity()
@Unique(["username"])
@Unique(["email"])
export class User implements UserInterface {
    @Field((): typeof ID => ID)
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Field()
    @Column()
    public email: string;

    @Field()
    @Column({ nullable: true })
    public username: string;

    @Column()
    public password: string;

    @Column({ type: "text", array: true, nullable: true })
    public roles: [string];

    public hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}