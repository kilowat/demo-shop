import IAuthRepository from "../domain/IAuthRepository"
import IPasswordService from "../services/IPasswordService";
import ITokentService from "../services/ITokenService";
import * as express from 'express';
import AuthController from "./AuthController";
import SigninUsecase from "../usecases/SigninUsecase";

export default class AuthRouter {
  public static configure(
    authRepository: IAuthRepository,
    tokenService: ITokentService,
    passwordService: IPasswordService,
  ) : express.Router {
    const router = express.Router();
    let controller = AuthRouter.composeController(
      authRepository,
      tokenService,
      passwordService,
    );
    router.post('/signin', (req, res) => controller.signin(req, res));

    return router;
  }

  private static composeController(
    authRepository: IAuthRepository,
    tokenService: ITokentService,
    passwordService: IPasswordService,
  ) : AuthController{
    const signinUseCase = new SigninUsecase(authRepository, passwordService);
    const controller = new AuthController(signinUseCase, tokenService);

    return controller;
  }
}