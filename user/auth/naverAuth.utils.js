import fetch from 'node-fetch';
import logger from '../../logger';
// CgGKJQIcMKgghIFgfJ
export const naver_auth = async (token) => {
  let data = null;
  const tokenVaildation = `https://openapi.naver.com/v1/nid/me`;
  await fetch(tokenVaildation, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      data = json;
      logger.info(`${__dirname}|${data}`);
    })
    .catch((err) => logger.error(`${__dirname}|${err}`));

  if (data.resultcode === '00') {
    // 00->Success
    return data.response.email;
  } else {
    return null;
  }
};
