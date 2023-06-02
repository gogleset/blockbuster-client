import React, { useState, useEffect } from 'react';

import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const WaitingRoom = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(3);

  // 게임 시작 누를시
  function handleGameStartButtonEvent(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    // 티켓이 있을 경우에만
    if (ticket > 0) {
      return navigate('/playgrounds');
    } else {
      Swal.fire('Please buy a ticket');
    }
  }

  function handleTokenBuyButtonEvent(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    Swal.fire({
      title: 'How many tickets will you buy?',
      icon: 'question',
      input: 'range',
      inputAttributes: {
        min: '1',
        max: '120',
        step: '1',
      },
      inputValue: 10,
    });
  }
  useEffect(() => {
    if (!isConnected) {
      return navigate('/');
    } else {
    }
  }, [isConnected]);
  return (
    <div className='flex flex-col w-8/12 bg-slate-600 justify-center mt-12'>
      <div className='flex flex-col w-full bg-slate-50 justify-center text-center align-middle h-screen'>
        <div className='text-2xl m-8'>
          <h1>Token {ticket}</h1>
        </div>
        <div className='flex flex-col items-center'>
          <button
            className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-50 m-5'
            onClick={handleTokenBuyButtonEvent}
          >
            토큰 구매하기
          </button>
          {/* 토큰 상태별로 분기처리 */}
          {ticket > 2 && (
            <button
              className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-50'
              onClick={handleGameStartButtonEvent}
            >
              게임시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
