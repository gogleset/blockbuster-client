import axios from 'axios';
import Swal from 'sweetalert2';

// types
type sendLogin = (wallet: string | undefined) => object | unknown;
type sendWithdrawal = (wallet: string | undefined) => object | unknown;
type sendNickname = (
  wallet: string | undefined,
  nickname: string | undefined
) => object | unknown;

type sendBuyToken = (wallet: string | undefined, count: number) => any;
type sendRandomProblem = (count: string) => any;

// 로그인 조회
export const sendMemberLogin: sendLogin = async (wallet) => {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}member/login`,
      {
        wallet: wallet,
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};

// 회원가입
export const sendNickname: sendNickname = async (wallet, nickname) => {
  if (nickname !== undefined && wallet !== undefined) {
    // 닉네임 공백제거
    const nickstr = nickname.replace(/\s+/g, '');
    console.log(typeof nickstr, nickstr);
    console.log(typeof wallet, wallet);
    try {
      if (nickname.length > 0) {
        const result = await axios.post(
          `${process.env.REACT_APP_DEV_SERVER_ADDRESS}member/signup`,
          {
            wallet: wallet,
            nickname: nickstr,
          }
        );
        return result;
      } else {
        Swal.fire('닉네임을 입력해주세요.');
      }
    } catch (error) {
      return error;
    }
  }
};

// 회원탈퇴
export const sendMemberWithdrawal: sendWithdrawal = async (wallet) => {
  try {
    const result = await axios.delete(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}member/withdrawl`,
      {
        data: {
          wallet: wallet,
        },
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};

// 토큰구입
export const sendBuyTokens: sendBuyToken = async (
  wallet,
  count
): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}ticket/buy`,
      {
        wallet: wallet,
        count: count,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const sendRandomProblems: sendRandomProblem = async (
  count
): Promise<object> => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}problem/random?length=${count}`
    );
    return result;
  } catch (error) {
    throw error;
  }
};
