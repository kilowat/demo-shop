import { NextFunction, Request, Response } from "express";
import ITokentService from "../services/ITokenService";
import ITokenStore from "../services/ITokenStore";

export default class TokenValidator {
  constructor(
    private readonly tokenService: ITokentService,
    private readonly tokenStore: ITokenStore,
  ) {}

  public async validate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Auth token required' });
    if (this.tokenService.decode(authHeader) === '' ||
      (await this.tokenStore.get(authHeader)) !== '') 
      return res.status(403).json({ error: 'Invalid token' });
    
    next();
  }
}