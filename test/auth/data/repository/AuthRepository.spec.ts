import mongoose from "mongoose";
import dotenv from 'dotenv';
import AuthRepository from "../../../../src/auth/data/repository/AuthRepository";
import { expect } from "chai";

dotenv.config();

describe("AuthRepository",() => {
  let client: mongoose.Mongoose;
  let sut: AuthRepository;

  beforeEach(() => {
    client = new mongoose.Mongoose();
    const connectionUriStr = encodeURI(process.env.SHOP_DB as string);
    const connectOptions =       {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    client.connect(connectionUriStr, connectOptions);

    sut = new AuthRepository(client);
  });
  
  afterEach(() => {
    client.disconnect();
  });

  it('should return user id when added', async() => {
    const name = 'Ken';
    const type = 'email';
    const email = 'baller@gg.com';
    const password = 'pasword123';

    const result = await sut.add(
      name,
      email,
      type,
      password,
    );

    expect(result).to.not.be.empty;
  });

  it('should return user id', async () => {
    const email = 'baller@gg.com';

    const result = await sut.find(email);

    expect(result).to.not.be.empty;

  });

});