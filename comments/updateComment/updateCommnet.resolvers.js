import client from '../../client';
import { processHashtags } from '../../hashtag/hashtag.utils';
import { exceptionsHandler } from '../../shared/shard.utils';
import { protectedResolver } from '../../user/users.utils';

const updateCommentFN = async (_, { id, payload }, { loggedInUser, logger }) => {
  // 유저 유효성검사
  const exceptionResult = await exceptionsHandler(loggedInUser);
  if (exceptionResult !== 1) {
    return {
      ok: false,
      error: exceptionResult,
    };
  }
  // 댓글 유효성검사
  try {
    const existComment = await client.comment.findUnique({
      where: {
        id,
      },
      select: {
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
    });
    // 댓글 존재하지 않음
    if (!existComment) {
      // Error Handling
      logger.error(`${__dirname}|NOTFOUND_COMMENTID|%o`, id);

      return {
        ok: false,
        error: process.env.NotFound_Comment,
      };
    }
    console.log(existComment.hashtags);
    // 댓글 업데이트
    const result = await client.comment.update({
      where: {
        id,
      },
      data: {
        payload,
        // 해시태그 재참조
        hashtags: {
          disconnect: existComment.hashtags,
          connectOrCreate: processHashtags(payload),
        },
      },
    });
    logger.info(`${__dirname}|UpdateCOMMENT:|%o`, result);
    return {
      ok: true,
    };
  } catch (e) {
    logger.error(`${__dirname}|TRANSECTIONERROR|%o`, e);
    return {
      ok: false,
      error: process.env.Transaction_ERROR,
    };
  }
};

export default {
  Mutation: {
    updateComment: protectedResolver(updateCommentFN),
  },
};
