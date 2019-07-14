import { Resolver, Query, Arg, Mutation } from "type-graphql";

import { RegisterInput } from "./register.input";
import { LoginInput } from "./login.input";
import { Inject } from "typedi";
import { UserService } from "./user.service";
import { User } from "../../entities/user";
import { AuthenticationError } from "apollo-server";


@Resolver()
export class AuthResolver {
    @Inject()
    private readonly userService: UserService;

    @Query((): StringConstructor => String)
    public async login(@Arg("login") loginInput: LoginInput): Promise<string> {
        try {
            return await this.userService.login(loginInput);
        } catch(e) {
            throw new AuthenticationError("invalid login or password");
        }
    }

    @Mutation((): typeof User => User)
    public async register(@Arg("user") registerInput: RegisterInput): Promise<User> {
        return this.userService.register(registerInput);
    }
}