import { Model, Mongoose } from "mongoose";
import IAuthRepository from "../../domain/IAuthRepository";
import User from "../../domain/User";
import { UserModel, UserSchema } from "../models/UserModel";

export default class AuthRepository implements IAuthRepository{
  constructor(private readonly client: Mongoose) {}

  async find(email: string): Promise<User> {
    const users = this.getUserModel();
    const user = await users.findOne({ email: email });
    
    if (!user) return Promise.reject('User not found');

    return new User(user.id, user.name, user.email, user.password, user.type);
  }
  public async add(name: string, email: string, passwordHash: string, type: string): Promise<string> {
    const userModel = this.getUserModel();
    const savedUser = await userModel.create({
      name: name,
      email: email,
      type: type,
      password: passwordHash,
    })

    return savedUser.id;
  }

  private getUserModel(): Model<UserModel> {
    return this.client.model<UserModel>('User', UserSchema);
  }
}