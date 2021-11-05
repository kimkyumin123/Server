import client from "../../client";

export default {
  Query: {
    searchPlace: async (_, { title, category, lastId }, { logger }) => {
      //title 값으로 시작하는 장소 올림차순 정렬 (업데이트날짜 기준)-> result ===null이면 검색결과 없음
      //카테고리별 검색
      const result = await client.place.findMany(
        {
          where: {
            title: {
              startsWith: title,
            },
            ...(category && { category }),
          },
          orderBy: {
            updatedAt: "asc",
          },
          take: 10,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }), //cursor => 마지막 요소 저장
        } ?? []
      );

      // logger.info('SearchPlace | %o',result)
      logger.info(`${__dirname}| %o`, result);

      return result;
    },
  },
};
