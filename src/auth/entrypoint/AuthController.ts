import ITokentService from "../services/ITokenService";
import SigninUsecase from "../usecases/SigninUsecase";
import * as express from 'express';
import SignupUseCase from "../usecases/SignUpUsecase";
import SignoutUsecase from "../usecases/SignoutUsecase";


export default class AuthController {
  private readonly signInUseCase : SigninUsecase;
  private readonly signUpUseCase: SignupUseCase;
  private readonly signOutUseCase: SignoutUsecase;
  private readonly tokenService: ITokentService;

  constructor(
    signInUseCase: SigninUsecase,
    signUpUseCase: SignupUseCase,
    signOutUseCase: SignoutUsecase,
    tokenService: ITokentService,
  ) {
    this.signInUseCase = signInUseCase;
    this.signUpUseCase = signUpUseCase;
    this.signOutUseCase = signOutUseCase;
    this.tokenService = tokenService;
  }

  public async signin(req: express.Request, res: express.Response) {
    try {
      const { name, email, password, auth_type } = req.body;
      return this.signInUseCase
        .execute(name, email, password, auth_type)
        .then((id: string) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
        .catch((err: Error) => res.status(404).json({ error: err.message }));
    } catch (err) {
      return res.status(400).json( { error: err });
    }
  }

  public async signup(req: express.Request, res: express.Response) {
    try {
      const { name, email, password, auth_type } = req.body;
      return this.signUpUseCase
        .execute(name, auth_type, email, password)
        .then((id: string) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
        .catch((err: Error) => res.status(404).json({ error: err.message }));
    } catch (err) {
      return res.status(400).json( { error: err });
    }
  }

  public async signout(req: express.Request, res: express.Response) {
    try {
      const token = req.headers.authorization!;
      return this.signOutUseCase
        .execute(token)
        .then((results) => res.status(200).json({ message: results }))
        .catch((err: Error) => res.status(404).json({ error: err.message }));
    } catch (err) {
      return res.status(400).json( { error: err });
    }
  }
}