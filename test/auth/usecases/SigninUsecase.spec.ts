import 'mocha'
import chai, {expect} from 'chai'
import SigninUsecase from '../../../src/auth/usecases/SigninUsecase';
import IAuthRepository from '../../../src/auth/domain/IAuthRepository';
import IPasswordService from '../../../src/auth/services/IPasswordService';
import FakeRepository from '../helpers/FakeRepository';
import FakePasswordService from '../helpers/FakePasswordService';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('SigninUsecase', () => {
  let sut: SigninUsecase;
  let repository: IAuthRepository;
  let passwordService: IPasswordService;

  const user = {
    email: 'baller@gg.com',
    id: '1234',
    name: 'Ken',
    password: '$2b$10$K0HEqyYUlQLaj.Xkp9tDzuRclzJqdKCYV7gEHtSVIlu8NRtLM6flC',
    type: 'email',
  };

  beforeEach(() => {
    repository = new FakeRepository();
    passwordService = new FakePasswordService();
    sut = new SigninUsecase(repository, passwordService);
  });

  it('should throw error if user not find', async () => {
    const user = {name: 'John', email: 'wrong@email.com', password: '1234'};
    await expect(sut.execute(user.name, user.email, user.password, 'email')).to.be.rejectedWith('User not found');
  });

  it('should return user id when user email and password is correct', async () => {
    //act
    const id = await sut.execute(
      user.name,
      user.email,
      user.password,
      user.type
    )
    //assert
    expect(id).to.be.equal(user.id)
  });

});