import ITokentService from "../services/ITokenService";
import SigninUsecase from "../usecases/SigninUsecase";
import * as express from 'express';

export default class AuthController {
  private readonly signInUseCase : SigninUsecase;
  private readonly tokenService: ITokentService;

  constructor(signInUseCase: SigninUsecase, tokenService: ITokentService) {
    this.signInUseCase = signInUseCase;
    this.tokenService = tokenService;
  }

  public async signin(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;
      return this.signInUseCase.execute(email, password).then((id: string) => {
        res.status(200).json({ auth_token: this.tokenService.encode(id) });
      }).catch((err: Error) => res.status(401).json({ error: err.message }));
    } catch (err) {
      return res.status(400).json( { error: err });
    }
  }
}