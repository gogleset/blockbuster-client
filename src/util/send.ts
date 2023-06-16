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
type sendUseTicket = (
  wallet: string | undefined,
  count: number,
  res: boolean
) => any;
type sendWin = (wallet: string | undefined) => any;

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
export const sendNicknames: sendNickname = async (wallet, nickname) => {
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
// 랜덤 글자 뽑기
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
//티켓 사용
export const sendUseTickets: sendUseTicket = async (
  wallet,
  count,
  res
): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}ticket/use`,
      {
        wallet: wallet,
        count: count,
        result: res,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
//보상 티켓 획득
export const sendRewardTicket: sendUseTicket = async (
  wallet,
  count,
  res
): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}ticket/reward`,
      {
        wallet: wallet,
        count: count,
        result: res,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
//보상 티켓 사용
export const sendExchangeTicket: sendUseTicket = async (
  wallet,
  count,
  res
): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}ticket/exchange`,
      {
        wallet: wallet,
        count: count,
        result: res,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

//승리 카운트 1 증가
export const sendWinCount: sendWin = async (wallet): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}count/win`,
      {
        wallet: wallet,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

//패배 카운트 1 증가
export const sendLoseCount: sendWin = async (wallet): Promise<object> => {
  try {
    const result = await axios.put(
      `${process.env.REACT_APP_DEV_SERVER_ADDRESS}count/lose`,
      {
        wallet: wallet,
      }
    );
    return result;
  } catch (error) {
    throw error;
  }
};
