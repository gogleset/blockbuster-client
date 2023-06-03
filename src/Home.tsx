import { useNavigate, Link } from 'react-router-dom';
import MetamaskConnectButton from './components/buttons/MettamaskConnectButton';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected) {
      navigate('/waiting');
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
            <Link to='/Join'>처음이신가요?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
