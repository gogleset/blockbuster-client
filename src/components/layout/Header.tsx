import { Link } from 'react-router-dom';
import TokenImage from '../../asset/img/Group.svg';
import QuestionImage from '../../asset/img/Question.svg';
import { useAccount } from 'wagmi';
import Swal from 'sweetalert2';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../store/context';

const Header = () => {
  const { isConnected } = useAccount();
  const { nickname, ticket_count, stateView } = useContext(UserContext);

  return (
    <div className='flex flex-row w-full bg-slate-100 h-12 justify-center items-center absolute top-0 left-0 border-2 border-b-black '>
      <div className='flex flex-row w-10/12 bg-slate-300 justify-between'>
        <div className='flex items-center'>
          <Link to='/' className='mr-1'>
            WARDLE
          </Link>
          <img
            src={QuestionImage}
            alt='QuestionImage number'
            onClick={() => {
              Swal.fire({
                title: 'Rules!',
                text: `Have you ever played a game called Wordle? It's a fun word-guessing game! The rules are simple. You have to guess a hidden word with five letters within six attempts. In each turn, you guess a word and the game provides hints to help you make more accurate guesses.\n
The hints are indicated by colors! Green means you guessed a correct letter in the right position. Yellow means you guessed a correct letter, but it's in the wrong position. Gray means the letter is not in the word.\n
If you guess the hidden word within six attempts, you win! Enjoy playing Wordle and experience the excitement of finding the hidden word!`,
                imageUrl:
                  'https://www.nytimes.com/games-assets/v2/assets/wordle/wordle_og_1200x630.png',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
              });
            }}
          />
        </div>
        {isConnected ? (
          <div className='flex w-30 bg-slate-200'>
            <div className='flex item-center bg-slate-700 mr-5'>
              <img src={TokenImage} alt='TokenImage number' />
              <div className='pt-0.5 ml-1'>
                <span>X {ticket_count}</span>
              </div>
            </div>
            <div className='w-30 bg-slate-200'>{nickname}</div>
          </div>
        ) : (
          <div>지갑에 연결해주세요</div>
        )}
      </div>
    </div>
  );
};

export default Header;
