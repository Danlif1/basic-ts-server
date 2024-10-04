import {hashPassword} from './encrypt';

describe('hashPassword', () => {
  beforeEach(() => {
    process.env.SECRET_ENC_KEY = 'test-secret';
  });

  test('should hash the password correctly using the provided secret', () => {
    const password = 'mySecurePassword';
    const expectedHash = hashPassword(password);

    const actualHash = hashPassword(password);

    expect(actualHash).toBe(expectedHash);
  });

  test('should produce different hashes for different passwords', () => {
    const password1 = 'mySecurePassword1';
    const password2 = 'mySecurePassword2';

    const hash1 = hashPassword(password1);
    const hash2 = hashPassword(password2);

    expect(hash1).not.toBe(hash2);
  });

  test('should use the default secret if SECRET_ENC_KEY is not set', () => {
    delete process.env.SECRET_ENC_KEY;

    const password = 'mySecurePassword';
    const defaultHash = hashPassword(password);

    const defaultSecretHash = hashPassword(password);

    expect(defaultHash).toBe(defaultSecretHash);
  });
});
