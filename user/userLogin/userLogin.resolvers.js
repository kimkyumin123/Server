import client from '../../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenIssuance } from '../users.utils';
import logger from '../../logger';
export default {
  Mutation: {
    userLogin: async (_, { userName, password }) => {
      const user = await client.user.findFirst({
        where: { userName },
        select: { id: true, password: true },
      });
      logger.info(`${__dirname}|User: %o`,user);
      if (!user) {
        logger.error(`${__dirname}User_NOTFOUND::%o`,userName);
        return {
          ok: false,
          error: process.env.NotFound_User,
        };
      }
      logger.info(`${__dirname}| %o`, user);
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        logger.error(`${__dirname}|User_PASSWORD_NotMached|%o`,password);
        return {
          ok: false,
          error: process.env.Incorrect_Password,
        };
      }
      // 우선은 userId만 전달 추후 필요하면 수정

      const token = tokenIssuance(user.id);

      return {
        ok: true,
        token,
      };
    },
  },
};
