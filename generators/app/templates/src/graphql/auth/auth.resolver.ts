import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { MyError } from "../../utils/error";
import { UserError } from "../../utils/genericTypes";
import { LoginInput, RegisterInput } from "./auth.input";
import { LoginPayload, LoginType, RegisterPayload } from "./auth.payload";
import { UserService } from "./user.service";

@Resolver()
export class AuthResolver {
    @Inject()
    private readonly userService: UserService;

    @Query((): typeof LoginPayload => LoginPayload)
    public async login(@Arg("input") input: LoginInput): Promise<typeof LoginPayload> {
        try {
            const loginType = new LoginType();
            const token = await this.userService.login(input.email, input.password);

            loginType.token = token;
            return loginType;
        } catch(e) {
            if (e instanceof MyError) {
                return new UserError(e.message);
            }
        }
    }

    @Mutation((): typeof RegisterPayload => RegisterPayload)
    public async register(@Arg("input") input: RegisterInput): Promise<typeof RegisterPayload> {
        try {
            return await this.userService.register(input.username, input.password, input.email);
        } catch(e) {
            if (e instanceof MyError) {
                return new UserError(e.message);
            }
        }
    }
}