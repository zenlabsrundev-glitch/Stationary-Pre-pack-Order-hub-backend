import { RegisterUseCase } from '../src/application/usecases/register';
import { UserRepository } from '../src/adapters/repositories/userRepository';
import { NodemailerEmailService } from '../src/infrastructure/emailService';
import * as dotenv from 'dotenv';
dotenv.config();

async function testRegistration() {
  const userRepository = new UserRepository();
  const emailService = new NodemailerEmailService();
  const registerUseCase = new RegisterUseCase(userRepository, emailService);

  const userData = {
    fullName: 'Test User',
    email: 'test' + Date.now() + '@gmail.com',
    role: 'student' as any,
    department: 'BE',
    dateOfBirth: '2002-05-15',
    address: 'Test Address',
    phoneNumber: '1234567890'
  };

  try {
    console.log('Starting registration...');
    const result = await registerUseCase.execute(userData);
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed with error:', error);
  }
}

testRegistration();
