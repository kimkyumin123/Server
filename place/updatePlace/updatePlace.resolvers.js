import client from '../../client';
import logger from '../../logger';
import { exceptionsHandler } from '../../shared/shard.utils';
import { protectedResolver } from '../../user/users.utils';

const updatePlaceResult = async (e) => {
  try {
    // 해당장소 유효확인
    const existPlace = await client.place.findFirst({
      where: {
        id: e.id,
      },
      select: {
        id: true,
      },
    });
    logger.info(`${__dirname}|existPlace::%o`, existPlace);
    if (!existPlace) {
      logger.info(`${__dirname}|NOTFOUND_PLACE::${e.id}`);
      return process.env.NotFound_Place;
    }

    // 장소 업데이트
    const placeResult = await client.place.update({
      where: {
        id: e.id,
      },
      data: {
        ...(e.title && { title: e.title }),
        ...(e.address && { address: e.address }),
        ...(e.zipCode && { zipCode: e.zipCode }),
        ...(e.x && { x: e.x }),
        ...(e.y && { y: e.y }),
        ...(e.category && { category: e.category }),
        ...(e.placeId && { uniqueId: e.placeId }),
      },
    });
    logger.info(`${__dirname}|placeResult::%o`, placeResult);
    return true;
  } catch (e) {
    logger.error(`${__dirname}|%o`, e);
    return process.env.Transaction_ERROR;
  }
};
const updatePlaceFN = async (_, { place }, { logger, loggedInUser }) => {
  const exceptionResult = await exceptionsHandler(loggedInUser);
  if (exceptionResult !== 1) {
    return {
      ok: false,
      error: exceptionResult,
    };
  }
  // 결과 값 확인용도
  let result = null;
  for (const i in place) {
    result = await updatePlaceResult(place[i], loggedInUser);
    if (result === process.env.NotFound_Place || result === process.env.Transaction_ERROR) {
      // 에러
      break;
    }
  }
  // 업데이트 성공
  if (result === true) {
    return {
      ok: true,
    };
  }
  // 업데이트 실패
  else {
    return {
      ok: false,
      error: result,
    };
  }
};
export default {
  Mutation: {
    updatePlace: protectedResolver(updatePlaceFN),
  },
};
