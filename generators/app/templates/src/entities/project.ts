import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";

@ObjectType()
@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Field((): StringConstructor => String)
    @Column()
    public name: string;

    @Field((): DateConstructor => Date)
    @Column()
    @CreateDateColumn()
    public createdAt: Date;

    @Field((): DateConstructor => Date)
    @Column()
    @UpdateDateColumn()
    public updatedAt: Date;

    @Field((): typeof User => User)
    @ManyToOne((): typeof User => User)
    public owner: User;
}