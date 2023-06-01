const Join = () => {
  return (
    <div className='flex flex-col items-center '>
      <div className='flex justify-center'>
        <input type='text' className='rounded-sm' />
      </div>
      <div className='m-8'>
        <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-40'>
          가입하기
        </button>
      </div>
    </div>
  );
};

export default Join;
