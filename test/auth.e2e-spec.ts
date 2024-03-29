import { INestApplication } from '@nestjs/common';
import { AuthController } from '@src/modules/auth/auth.controller';
import prisma from './client';
import { users } from './fixtures/users';
import { applyFixtures } from './utils/applyFixtures';
import { userConfirmationTokens } from './fixtures/user-confirmation-tokens';
import { SignUpRequest } from '@protogen/auth/auth';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let controller: AuthController;

  beforeEach(async () => {
    app = (global as any).app;
    controller = app.get<AuthController>(AuthController);

    await applyFixtures(users, prisma.user);
    await applyFixtures(userConfirmationTokens, prisma.userConfirmationToken);
  });

  it('signs up', async () => {
    const user: SignUpRequest = {
      email: 'allgiveaway1.uz@gmail.com',
      phoneNumber: '+9989888888888',
      fullName: 'Test Testerov',
      password: 'Test1234',
    };

    const response = await controller.signUp(user);

    expect(response.errors).toEqual(null);
  });

  it('signs in', async () => {
    const user = {
      email: 'allgiveaway.uz@gmail.com',
      password: 'Test12345',
    };

    const response = await controller.signIn(user);

    const result = response.result;

    expect(result.email).toEqual(user.email);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toEqual('');
  });

  it('verifies the email token', async () => {
    const request = {
      guid: '66e33c1b-938a-497b-89db-56532322ac49',
      verificationToken: 'aaaa-aaaa-aaaa-aaaa-56532322ac49',
    };

    const result = await controller.verifyEmailToken(request);
    expect(result.errors).toBe(null);
  });

  it('error while verify the email token (ver. token)', async () => {
    const request = {
      guid: '66e33c1b-938a-497b-89db-56532322ac49',
      verificationToken: 'aaaa-aaaa-aaaa-aaaa-56532322ac10',
    };

    try {
      await controller.verifyEmailToken(request);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('error while verify the email token (guid)', async () => {
    const request = {
      guid: '66e33c1b-938a-497b-89db-56532322ac10',
      verificationToken: 'aaaa-aaaa-aaaa-aaaa-56532322ac49',
    };

    try {
      await controller.verifyEmailToken(request);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('errors invalid email login', async () => {
    const user = {
      email: 'test_email@gmail.com',
      password: 'test12345',
    };

    try {
      await controller.signIn(user);
    } catch (errors) {
      expect(errors).toBeInstanceOf(Error);
    }
  });

  it('Fully signs up', async () => {
    const user: SignUpRequest = {
      email: 'allgiveaway1.uz@gmail.com',
      phoneNumber: '+9989888888888',
      fullName: 'Test Testerov',
      password: 'Test1234',
    };

    const signUpResponse = await controller.signUp(user);

    const { guid, verificationToken, confirmationLink } = signUpResponse.result;

    expect(guid).toBeDefined();
    expect(verificationToken).toBeDefined();
    expect(confirmationLink).toBeDefined();

    const { errors } = await controller.verifyEmailToken({
      guid,
      verificationToken,
    });

    expect(errors).toBe(null);

    const signInResponse = await controller.signIn({
      email: user.email,
      password: user.password,
    });

    const signInResult = signInResponse.result;

    expect(signInResult.email).toEqual(user.email);
    expect(signInResult.accessToken).toBeDefined();
    expect(signInResult.refreshToken).toBeDefined();
  });

  it('Fails if no confirmation', async () => {
    const user: SignUpRequest = {
      email: 'allgiveaway1.uz@gmail.com',
      phoneNumber: '+9989888888888',
      fullName: 'Test Testerov',
      password: 'Test1234',
    };

    const signUpResponse = await controller.signUp(user);

    const { guid, verificationToken, confirmationLink } = signUpResponse.result;

    expect(guid).toBeDefined();
    expect(verificationToken).toBeDefined();
    expect(confirmationLink).toBeDefined();

    try {
      await controller.signIn({
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
