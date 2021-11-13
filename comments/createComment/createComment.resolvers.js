import client from '../../client';
import { processHashtags } from '../../hashtag/hashtag.utils';
import { exceptionsHandler } from '../../shared/shard.utils';
import { protectedResolver } from '../../user/users.utils';

const createCommentFN = async (_, { payload, reviewId }, { loggedInUser, logger }) => {
  // 유저 유효성검사
  const exceptionResult = await exceptionsHandler(loggedInUser);
  if (exceptionResult !== 1) {
    return {
      ok: false,
      error: exceptionResult,
    };
  }
  // 게시글 확인
  const reviewResult = await client.review.findUnique({
    where: { id: reviewId },
  });
  if (!reviewResult) {
    // 에러핸들링
    logger.error(`${__dirname}|NOTFOUND_REVIEWID|%o`, reviewId);
    return {
      ok: false,
      error: process.env.NotFound_Review,
    };
  }

  // 댓글생성
  try {
    const resultComent = await client.comment.create({
      data: {
        payload,
        review: {
          connect: {
            id: reviewId,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        hashtags: {
          connectOrCreate: processHashtags(payload),
        },
      },
    });
    return {
      ok: true,
    };
  } catch (e) {
    logger.error(`${__dirname}|TRANSECTION_ERROR|%o`, e);
    return {
      ok: false,
      error: process.env.Transaction_ERROR,
    };
  }
};
export default {
  Mutation: {
    createComment: protectedResolver(createCommentFN),
  },
};
