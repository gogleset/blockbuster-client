import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

import { checkMobile } from '../../util/userAgentHelper/userAgent';

export default function MetamaskConnectButton() {
  const USER_AGENT = checkMobile();
  const navigate = useNavigate();

  // 로그인 관련
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect({
    // 로그인 성공 실패 구현
    onSettled(data, error): void {
      // 성공
      if (data) {
        console.log(data);
        navigate('/playgrounds');
        // 실패
      } else {
        const { name }: any = error;
        switch (name) {
          case 'ConnectorNotFoundError':
            if (USER_AGENT === 'other') {
              alert('메타마스크 지갑을 설치해주세요');
              window.open(
                'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ko'
              );
              // 안드로이드기종
            } else if (USER_AGENT === 'android') {
              // 딥링크 이동
              alert('메타마스크로 이동합니다.');
              navigate(
                'https://metamask.app.link/dapp/blockbuster-app-client.vercel.app/'
              );
            } else if (USER_AGENT === ('ios' || 'iphone' || 'ipad' || 'ipod')) {
              alert('메타마스크로 이동합니다.');
              navigate(
                'https://metamask.app.link/dapp/blockbuster-app-client.vercel.app/'
              );
            }
            break;
        }
      }
    },
  });
  const connector = connectors[0];
  // const { disconnect } = useDisconnect();
  // 로그인 확인
  useEffect(() => {
    !isConnected && navigate('/');
  }, [isConnected, navigate]);

  // 지갑 연결
  function onConnectClickHandler(): void {
    connect({ connector });
  }

  // function onDisConnectClickHandler(): void {
  //   disconnect();
  //   navigate('/');
  // }

  return (
    // <>
    //   {isConnected ? (
    //     <button
    //       className='bg-sky-500 hover:bg-sky-700 w-20 rounded-2xl'
    //       onClick={onDisConnectClickHandler}
    //     >
    //       로그아웃
    //     </button>
    //   ) : (

    //   )}
    // </>
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
      onClick={onConnectClickHandler}
    >
      메타마스크 로그인
    </button>
  );
}
