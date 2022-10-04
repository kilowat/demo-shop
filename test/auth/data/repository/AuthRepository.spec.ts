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
    const password = '$2b$10$K0HEqyYUlQLaj.Xkp9tDzuRclzJqdKCYV7gEHtSVIlu8NRtLM6flC';

    const result = await sut.add(
      name,
      email,
      password,
      type,
    );

    expect(result).to.not.be.empty;
  });

  it('should return user id', async () => {
    const email = 'email@test.ru';
    const password = 'pass';

    const result = sut.find(email);

    expect(result).to.not.be.empty;

  });

});