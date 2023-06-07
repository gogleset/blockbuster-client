import React, { useRef } from 'react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import MetamaskConnectButton from '../buttons/MetamaskConnectButton';
import { sendNicknames } from '../../util/send';
import Swal from 'sweetalert2';
import { sendMemberLogin } from '../../util/send';
import { useContext } from 'react';
import { UserContext } from '../../store/context';
import { useDisconnect } from 'wagmi';

const Join = () => {
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  // 닉네임 받는 인풋
  const nicknameInput = useRef<HTMLInputElement>(null);
  const {
    setNickname,
    setLoseCount,
    setWinCount,
    setTicketCount,
    setRewardTicket,
  } = useContext(UserContext);

  return (
    <div className='flex flex-col justify-center items-center mt-12'>
      {/* 2. 연결 완료시 닉네임과 같이 가입하기 */}
      {isConnected ? (
        <div className='flex flex-col justify-center items-center mt-12'>
          <div className=''>
            <h1>닉네임을 입력해주세요</h1>
          </div>
          <div className='flex justify-center bg-black'>
            <input
              type='text'
              className='rounded-sm'
              id='InputNickName'
              ref={nicknameInput}
            />
          </div>
          <div className='m-8'>
            <button
              className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-40'
              onClick={async () => {
                // 3.닉네임 인풋이 있을 경우에만 ajax 통신
                if (nicknameInput.current !== null) {
                  console.log(address, nicknameInput.current.value);
                  try {
                    const result: any = await sendNicknames(
                      address,
                      nicknameInput.current.value
                    );
                    // 결과값 분기 처리 / 닉네임 글자가 있을 경우
                    if (result.data.result === true) {
                      Swal.fire('Welcome!').then(async () => {
                        try {
                          const result: any = await sendMemberLogin(address);
                          setNickname(result.data.user_info.nickname);
                          setLoseCount(result.data.user_info.lose_count);
                          setWinCount(result.data.user_info.win_count);
                          setTicketCount(result.data.user_info.ticket_count);
                          setRewardTicket(result.data.user_info.reward_count);
                          navigate('/waiting');
                        } catch (error) {
                          Swal.fire(`${error}`).then(() => {
                            disconnect();
                            navigate('/');
                          });
                        }
                      });
                      // 없을경우
                    } else {
                      Swal.fire(`${result.data.msg}`).then(() => {
                        // 닉네임 초기화
                        if (nicknameInput.current !== null) {
                          nicknameInput.current.value = '';
                        }
                      });
                    }
                  } catch (error) {
                    Swal.fire(`${error}`);
                  }
                } else {
                  Swal.fire('닉네임을 입력해주세요');
                }
              }}
            >
              가입하기
            </button>
          </div>
        </div>
      ) : (
        // 1. 메타마스크 연결
        <div>
          <MetamaskConnectButton />
        </div>
      )}
    </div>
  );
};

export default Join;
