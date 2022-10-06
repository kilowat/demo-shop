import mongoose from "mongoose";
import AuthRepository from "./auth/data/repository/AuthRepository";
import BcryptPasswordService from "./auth/data/services/BcryptPasswordServce";
import JwTokenService from "./auth/data/services/JwTokenService";
import AuthRouter from "./auth/entrypoint/AuthRouter";

export default class CompositionRoot {
  private static client: mongoose.Mongoose;

  public static configure() {
    this.client = new mongoose.Mongoose();
    const connectionStr = encodeURI(process.env.SHOP_DB as string);
    const connectOptions =       {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;
    this.client.connect(connectionStr, connectOptions);
  }

  public static authRouter() {
    const repository = new AuthRepository(this.client);
    const tokenService = new JwTokenService(process.env.PRIVATE_KEY as string);
    const passwordService = new BcryptPasswordService();
    
    return AuthRouter.configure(repository, tokenService, passwordService); 
  }
}