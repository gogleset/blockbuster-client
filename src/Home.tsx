import { useNavigate, Link } from 'react-router-dom';
import MetamaskConnectButton from './components/buttons/MetamaskConnectButton';
import { useDisconnect, useAccount } from 'wagmi';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { sendMemberLogin } from './util/send';
const Home = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    async function login() {
      // 로그인
      try {
        const result: any = await sendMemberLogin(address);
        console.log(result);
        if (result.data.result === true) {
          navigate('/waiting');
        } else {
          Swal.fire(`조회된 정보가 없습니다. 회원가입을 해주세요`).then(() => {
            navigate('/join');
          });
        }
        return result;
        // 실패
      } catch (error) {
        Swal.fire(`${error}`).then(() => {
          disconnect();
          navigate('/');
        });
      }
    }
    if (isConnected) {
      login();
    }
  }, [isConnected, navigate]);
  return (
    <div className='flex flex-col w-8/12 bg-slate-600 justify-center'>
      {/* home */}
      <div className='flex flex-col w-full bg-slate-50 justify-center text-center align-middle bg-blue-400 h-screen'>
        <div className='text-2xl m-8'>
          <h1>Wardle</h1>
        </div>
        <div>
          {/* <button
            type='button'
            className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-40'
            onClick={() => navigate('/playgrounds')}
          >
            로그인
  </button> */}
          <MetamaskConnectButton />
          <div className='m-8'>
            <Link to='/join'>처음이신가요?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
