import { Prisma } from '@prisma/generated';

export const users: Prisma.UserCreateInput[] = [
  {
    guid: '66e33c1b-938a-497b-89db-56532322ac49',
    email: 'allgiveaway.uz@gmail.com',
    password: '$2a$12$ew62ZAn6.b9FqXLhRpxu9O.PxAWuos4dPGRwc1MDA8D5YKVeTdLLS',
    // password: "Test12345"
    isActive: true,
    phoneNumber: '+99899999999',
    bidsAvailable: 0,
    // id: '507f191e810c19729de860e1',
    notificationsCount: 0,
    fullName: 'Test name',
    isDeleted: false,
  },
];
