import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";
import AuthRepository from "./auth/data/repository/AuthRepository";
import BcryptPasswordService from "./auth/data/services/BcryptPasswordServce";
import JwTokenService from "./auth/data/services/JwTokenService";
import RedisTokenStore from "./auth/data/services/RedisTokenStore";
import AuthRouter from "./auth/entrypoint/AuthRouter";
import TokenValidator from "./auth/helpers/TokenValidator";
import { promisify } from 'util';


export default class CompositionRoot {
  private static client: mongoose.Mongoose;
  private static redisClient: RedisClientType;

  public static async configure() {
    this.client = new mongoose.Mongoose();
    
    this.redisClient = createClient({
      url: 'redis://192.168.1.110:6379',
    });

    await this.redisClient.connect();
    console.log('redis started');
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
    const tokenStore = new RedisTokenStore(this.redisClient);
    const tokenValidator = new TokenValidator(tokenService, tokenStore);

    return AuthRouter.configure(
      repository, 
      tokenService, 
      tokenStore, 
      passwordService, 
      tokenValidator
    ); 
  }
}