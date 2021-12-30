import client from '../client';
import logger from '../logger';
//사용안함 
 const createPlace = async (element) => {
  try {
    const placeOverlap = await client.place.findUnique({
      where: {
        uniqueId: element.placeId,
      },
      select: {
        id: true,
      },
    });
    // 있을시 중복처리
    if (placeOverlap) {
      logger.info(`${__dirname}|Already Place %o`, placeOverlap);
      return placeOverlap.id;
    }
    // 없을시 장소생성
    else {
      try {
        const result = await client.place.create({
          data: {
            title: element.title,
            address: element.address,
            zipCode: element.zipCode,
            x: element.x,
            y: element.y,
            category: element.category,
            uniqueId: element.placeId,
          },
        });
        if (!result) {
          return process.env.CreateFail_Place;
        }
        logger.info(`${__dirname}| %o`, result);
        return result.id;
      } catch (e) {
        logger.error(`${__dirname}|%o`, e);
        return process.env.Transaction_ERROR;
      }
    }
  } catch (e) {
    logger.error(`${__dirname}|%o`, e);
    return process.env.Transaction_ERROR;
  }
};

export const aboutPlaceReview = async () => {};
