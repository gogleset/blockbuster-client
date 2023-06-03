import axios from 'axios';
import Swal from 'sweetalert2';

type loginsend = (wallet: string | undefined) => object | unknown;
type nicknamesend = (
  wallet: string | undefined,
  nickname: string | undefined
) => object | unknown;

// 로그인 조회
export const sendMemberLogin: loginsend = async (wallet) => {
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
export const sendNickname: nicknamesend = async (wallet, nickname) => {
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
