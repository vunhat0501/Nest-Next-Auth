import type { User } from '@prisma/client';

export type AuthRequest = {
  user: User;
};
