import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='flex flex-row w-full bg-slate-100 h-12 justify-between items-center absolute top-0 left-0'>
      <div></div>
      <Link to='/'>Wardle</Link>
      <div></div>
      {/* <button className=''>설정</button> */}
    </div>
  );
};

export default Header;
