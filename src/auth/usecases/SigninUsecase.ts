import IAuthRepository from "../domain/IAuthRepository";
import IPasswordService from "../services/IPasswordService";

export default class SigninUsecase{
  constructor(
    private authRepository: IAuthRepository, 
    private passwordService: IPasswordService) {
  }

  public async execute(name: string, email: string, password: string, type: string): Promise<string>{

    if(type === 'email') return this.emailLogin(email, password);
    return this.oauthLogin(name, email, type);
  }

  private async emailLogin(email:string, password: string) {
    const user = await this.authRepository.find(email);
    if (!user) return Promise.reject('Invalid password or email');

    const compare = await this.passwordService.compare(password, user.password);
    if (!compare) return Promise.reject('Invalid password or email');
    
    return user.id;
  }

  private async oauthLogin(name: string, email: string, type: string) {
    const user = await this.authRepository.find(email);
    if (user && user.email === 'email') {
      return Promise.reject('account alredy exists, login in with password')
    }
    if (user) return user.id;

    const userId = await this.authRepository.add(name, email, type);
    
    return userId;
  }
}