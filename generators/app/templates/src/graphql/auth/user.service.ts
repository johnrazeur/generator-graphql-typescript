import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";

import { User } from "../../entities/user";
import { InvalidEmailOrPasswordError, EmailAlreadyUseError, UsernameAlreadyUseError } from "./auth.error";

@Service()
export class UserService {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

    public async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email });
    }

    public async register(username: string, password: string, email: string): Promise<User> {
        if (await this.userRepository.findOne({ email })) {
            throw new EmailAlreadyUseError();
        }

        if (await this.userRepository.findOne({ username })) {
            throw new UsernameAlreadyUseError();
        }
        
        const user: User = this.userRepository.create({
            username,
            password,
            email
        });

        user.hashPassword();

        return this.userRepository.save(user);
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.getUserByEmail(email);

        if (!user || !user.checkIfUnencryptedPasswordIsValid(password)) {
            throw new InvalidEmailOrPasswordError();
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