import fetch from 'node-fetch';
import client from '../../client';
import logger from '../../logger';

// 액세스토큰 기본 6시간 발급
export const userProfile = async (accessToken) => {
  // 프로필 조회(사전에 동의 된 scope내)
  const profile = await fetch('https://kapi.kakao.com/v2/user/me', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
  if (profile.kakao_account) {
    // 조회성공
    logger.info(`${__dirname}|ReadSuccess_KAKAO_ACOUNT`);
    return profile.kakao_account.email;
  } else {
    // 조회 실패
    logger.error(`${__dirname}|NotFound_KAKAO_ACOUNT`);
    return null;
  }
};
export const tokenVaildation = async (accessToken) => {
  // 토큰 유효성 검사

  const data = await fetch('https://kapi.kakao.com/v1/user/access_token_info', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
  if (data.code) {
    // 유효성 검사 실패
    logger.error(`${__dirname}|${data.msg}`);
    return false;
  } else {
    logger.info(`${__dirname}|KaKaoAuth_CHECK_SUCCESS`);
    return true;
  }
};
export const tokenDelete = async (accessToken) => {
  fetch('https://kapi.kakao.com/v1/user/unlink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.code);
  // DB Delete Code
};
export const tokenUpdate = async (refreshToken) => {
  // AccessToken 만료시 재발급

  const data = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body: `grant_type=refresh_token&client_id=${process.env.KAKAO_RESTKEY}&refresh_token=${refreshToken}&client_secret=${process.env.KAKAO_SecretKEY}`,
  }).then((res) => res.json());
  console.log(data);
  // AccessToken 트랜잭션
  const result = await client.authUser.update({
    where: {
      refreshToken,
    },
    data: {
      accessToken: data.accessToken,
    },
  });
  if (!result) {
    throw new Error('Token Update Failed');
  }

  return data;
};
