import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

//** Factory function to register jwt env */
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  }),
);
