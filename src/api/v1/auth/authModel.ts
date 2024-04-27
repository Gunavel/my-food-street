import { z } from 'zod';

import { USER_ROLE } from '@/api/constants';

const CreateUserSchema = z
  .object({
    name: z.string().min(6).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([USER_ROLE.CUSTOMER, USER_ROLE.RESTAURANT_ADMIN]),
  })
  .required();
export const CreateUserRequestSchema = z.object({
  body: CreateUserSchema,
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

const UserLoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();
export const UserLoginRequestSchema = z
  .object({
    body: UserLoginSchema,
  })
  .required();
export type UserLoginInput = z.infer<typeof UserLoginSchema>;

export const AuthNSchema = z
  .object({
    headers: z.object({
      authorization: z.string().startsWith('Bearer '),
    }),
  })
  .required();
