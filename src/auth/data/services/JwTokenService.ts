import ITokentService from "../../services/ITokenService";
import jwt from 'jsonwebtoken';
export default class JwTokenService implements ITokentService {
  constructor(private readonly privateKey: string) {}

  encode(paload: string | object): string | object {
    const token = jwt.sign({ data: paload }, this.privateKey, {
      issuer: 'com.myapp',
      expiresIn: '1h',
    });

    return token;
  }
  decode(token: string): string | object {
    try {
      const decoded = jwt.verify(token, this.privateKey);
      return decoded;
    } catch (err) {
      return 'Invalid token';
    }
  }

}