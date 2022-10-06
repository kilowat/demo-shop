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
    email: 'tester@gmail.com',
    id: '1556',
    name: 'Ren',
    password: '',
    auth_type: 'google',
  }

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
    const user = {
      email: 'wrongemail@gg.com',
      id: '1234',
      name: 'Ken',
      password: 'pass123',
      auth_type: 'email',
    }
    await request(app)
    .post('/auth/signin')
    .send({name: user.name, email: user.email, password: user.password, auth_type: user.auth_type, })
    .set('Accept', 'application/json')
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(404); 
  });

  it('should return 200 and token when user is found', async() => {
    await request(app)
    .post('/auth/signin')
    .send({name: user.name, email: user.email, password: user.password, auth_type: user.auth_type, })
    .set('Accept', 'application/json')
    .expect('Content-type', 'application/json; charset=utf-8')
    .expect(200)
    .then((res) => {
      expect(res.body.auth_token).to.not.be.empty;
    });
  })

  it('should create user and return token', async() => {
    let email = 'my@email.com'
    let name = 'test user'
    let password = 'pass123'
    let type = 'email'
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

