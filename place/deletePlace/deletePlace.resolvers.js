import client from '../../client';
import { exceptionsHandler } from '../../shared/shard.utils';
import { protectedResolver } from '../../user/users.utils';

const deletePlaceFN = async (_, { id }, { loggedInUser, logger }) => {
  const exceptionResult = await exceptionsHandler(loggedInUser);
  if (exceptionResult !== 1) {
    return {
      ok: false,
      error: exceptionResult,
    };
  }
  try {
    const result = await client.place.delete({
      where: {
        id,
      },
    });
    logger.info(`${__dirname}| %o`, result);
    return {
      ok: true,
    };
  } catch (e) {
    logger.error(`${__dirname}|${e}`);
    return {
      ok: false,
      error: process.env.DeleteFail_Place,
    };
  }
};
export default {
  Mutation: {
    deletePlace: protectedResolver(deletePlaceFN),
  },
};
