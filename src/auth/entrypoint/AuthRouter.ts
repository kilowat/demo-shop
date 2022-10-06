import IAuthRepository from "../domain/IAuthRepository"
import IPasswordService from "../services/IPasswordService";
import ITokentService from "../services/ITokenService";
import * as express from 'express';
import AuthController from "./AuthController";
import SigninUsecase from "../usecases/SigninUsecase";
import SignupUseCase from "../usecases/SignUpUsecase";
import { signinValidationRules, signupValidationRules, validate } from "../helpers/Validators";

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
    router.post(
      '/signin',
       signinValidationRules(), 
       validate, 
       (req: express.Request, res: express.Response) => 
        controller.signin(req, res));

    router.post(
      '/signup',
       signupValidationRules(),
        validate,
         (req: express.Request, res: express.Response) => 
          controller.signup(req, res)
    );

    return router;
  }

  private static composeController(
    authRepository: IAuthRepository,
    tokenService: ITokentService,
    passwordService: IPasswordService,
  ) : AuthController{
    const signinUseCase = new SigninUsecase(authRepository, passwordService);
    const signupUseCase = new SignupUseCase(authRepository, passwordService);
    const controller = new AuthController(signinUseCase, signupUseCase ,tokenService);

    return controller;
  }
}