import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SignupUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordService: IPasswordService,
    ) {}

    public async execute(
      name: string,
      authType: string,
      email: string,
      password: string,
    ): Promise<string>{
      const user = await this.authRepository.find(email).catch((_) => null);
      if (user) return Promise.reject('User already exists');
      
      const passwordHash = await this.passwordService.hash(password);
      const userId = await this.authRepository.add(
        name,
        email,
        passwordHash,
        authType
      );
      
      return userId;
    }
}