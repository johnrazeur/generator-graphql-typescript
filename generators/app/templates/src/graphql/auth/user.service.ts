import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";

import { User } from "../../entities/user";
import { RegisterInput } from "./register.input";
import { LoginInput } from "./login.input";

@Service()
export class UserService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

    public async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email });
    }

    public async register(registerInput: RegisterInput): Promise<User> {
        const user: User = this.userRepository.create({
            username: registerInput.username,
            password: registerInput.password,
            email: registerInput.email
        });

        user.hashPassword();

        return this.userRepository.save(user);
    }

    public async login(loginInput: LoginInput): Promise<string> {
        const user = await this.getUserByEmail(loginInput.email);

        if (!user.checkIfUnencryptedPasswordIsValid(loginInput.password)) {
            throw new Error("invalid credential");
        }

        const token = jwt.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return token;
    }
}