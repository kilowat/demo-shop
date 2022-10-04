import IAuthRepository from "../../../src/auth/domain/IAuthRepository";
import express from 'express';
import FakeRepository from "../helpers/FakeRepository";
import JwTokenService from "../../../src/auth/data/services/JwTokenService";
import BcryptPasswordService from "../../../src/auth/data/services/BcryptPasswordServce";
import AuthRouter from "../../../src/auth/entrypoint/AuthRouter";
import request from 'supertest';
import { expect } from "chai";

describe('AuthRouter', () => {
  let repository: IAuthRepository;
  let app: express.Application;

  const user = {
    email: 'baller@gg.com',
    id: '1234',
    name: 'Ken',
    password: '$2b$10$K0HEqyYUlQLaj.Xkp9tDzuRclzJqdKCYV7gEHtSVIlu8NRtLM6flC',
    type: 'email',
  };

  beforeEach(() => {
    repository = new FakeRepository();
    let tokenService = new JwTokenService('privateKey');
    let passwordService = new BcryptPasswordService(); 

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/auth', 
      AuthRouter.configure(repository, tokenService, passwordService)
    );
  });

  it("should return 404 when user is not found", async() => {
    await request(app)
    .post('/auth/signin')
    .send({})
    .expect(404); 
  });

  it('should return 200 and token when user is found', async() => {
    await request(app)
    .post('/auth/signin')
    .send({email: user.email, password: user.password})
    .set('Accept', 'application/json')
    .expect('Content-type', /json/)
    .expect(200)
    .then((res) => {
      expect(res.body.auth_token).to.not.be.empty;
    });
  })

  it('should create user and return token', async() => {
    let email = 'mail@may.com';
    let name = 'John';
    let password = 'pass123';
    let type = 'email'; 
    await request(app)
    .post('/auth/signup')
    .send({email: email, password: password, auth_type: type, name: name})
    .set('Accept', 'application/json')
    .expect('Content-type', /json/)
    .expect(200)
    .then((res) => {
      expect(res.body.auth_token).to.not.be.empty;
    });
  })

});

