import client from '../../client';
import { exceptionsHandler } from '../../shared/shard.utils';
import { protectedResolver } from '../../user/users.utils';

const deleteReviewFN = async (_, { id }, { loggedInUser, logger }) => {
  const exceptionResult = await exceptionsHandler(loggedInUser);
  if (exceptionResult !== 1) {
    return {
      ok: false,
      error: exceptionResult,
    };
  }
  try {
    const checkUser = await client.review.findFirst({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });
    logger.info(`${__dirname}| checkUser:: %o`, checkUser);
    // 글작성자만 지울 수 있음
    if (checkUser.userId !== loggedInUser.id) {
      logger.error(
        `${__dirname}CheckPermission_Review::checkUser::${checkUser.userId} && loggedInUser:${loggedInUser.id}`,
      );
      return {
        ok: false,
        error: process.env.CheckPermission,
      };
    }
    // 리뷰삭제
    const result = await client.review.delete({
      where: {
        id,
      },
    });
    logger.info(`${__dirname}|reviewDelete:: %o`, result);
    // reviewRoom==0이라면 리뷰룸도 삭제
    const reviewRoomResult = await client.review.count({
      where: {
        reviewRoomId: result.reviewRoomId,
      },
    });
    logger.info(`${__dirname}| findReviewRoom:: %o`, reviewRoomResult);
    if (reviewRoomResult === 0) {
      // 리뷰룸에 저장된 리뷰가 없을경우
      const reviewRoomDelete = await client.reviewRoom.delete({
        where: {
          id: result.reviewRoomId,
        },
      });

      logger.info(`${__dirname}| DeleteReviewRoom:: %o`, reviewRoomDelete);
    }
    return {
      ok: true,
    };
  } catch (e) {
    logger.error(`${__dirname}|${e}`);
    const customException = await exceptionsHandler(e);
    console.log(customException);
    return {
      ok: false,
      error: process.env.DeleteFail_Review,
    };
  }
};
export default {
  Mutation: {
    deleteReview: protectedResolver(deleteReviewFN),
  },
};
