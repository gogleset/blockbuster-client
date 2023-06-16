import './Wardle.module.css';
import { AlertContainer } from './components/alerts/AlertContainer';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { DatePickerModal } from './components/modals/DatePickerModal';
import { InfoModal } from './components/modals/InfoModal';
import { MigrateStatsModal } from './components/modals/MigrateStatsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { StatsModal } from './components/modals/StatsModal';
// import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings';
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SHARE_FAILURE_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings';
import { useAlert } from './context/AlertContext';
import { isInAppBrowser } from './lib/browser';
import {
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from './lib/localStorage';
import { addStatsForCompletedGame, loadStats } from './lib/stats';
import {
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  isWinningWord,
  isWordInWordList,
  setGameDate, // solution as sol,
  // solutionGameDate as solGameDate,
  unicodeLength,
} from './lib/words';
import {
  sendRandomProblems,
  sendRewardTicket,
  sendWinCount,
} from './util/send';
import { getRandomDate } from './util/random';
import { ClockIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import { useAccount } from 'wagmi';
import Swal from 'sweetalert2';
import Timer from './components/timer/Timer';
import { useContext } from 'react';
import { UserContext } from './store/context';
import { socket, intoRoom, sendMessage } from './util/socket';

function App() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  let {
    win_count,
    setLoseCount,
    setWinCount,
    setRewardTicket,
    reward_ticket,
    stateView,
  } = useContext(UserContext);
  const { address } = useAccount();

  // socket values
  // 게임의 룸 넘버 확인 변수
  const [roomNumber, setRoomNumber] = useState('');
  // 현재 참여한 게임 플레이어를 판별하기 위한 변수
  const [userNumber, setUserNumber] = useState(0);
  // userNumber를 업데이트 하기 위한 temp 변수
  const [userNum, setUserNum] = useState(0);
  let pending = true;
  const [userTurn, setUserTurn] = useState(1);
  // winner를 판별하기 위한 temp 변수
  const [winnerUser, setWinnerUser] = useState(Number);
  // 게임의 이긴 상태를 판별하기 위한 boolean 변수
  const [winning, setWinning] = useState(false);

  const [solution, setSolution] = useState('');
  const [solutionGameDate, setSolutionGameDate] = useState(new Date());
  // 문제 1.함수가 재 실행될때만 가능 처음 앱 실행시 실행되는 것 같음
  // 해결 방법 useEffect로 wardle이 실행될 때 함수 재실행하게 할 수 있음
  console.log(solution);
  // const isLatestGame = getIsLatestGame();

  let isLatestGame = getIsLatestGame();
  let gameDate = getGameDate();
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert();
  // 현재 쓴 word들 인거 같음
  const [currentGuess, setCurrentGuess] = useState('');
  // 게임 이기는 상태
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [currentRowClass, setCurrentRowClass] = useState('');
  // 게임 지는 상태
  const [isGameLost, setIsGameLost] = useState(false);
  // 다크모드 전환
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  );
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  );
  const [isRevealing, setIsRevealing] = useState(false);
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame);
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true);
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      });
    }
    return loaded.guesses;
  });

  const [stats, setStats] = useState(() => loadStats());

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  );

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true);
      }, WELCOME_INFO_MODAL_MS);
    }
  });

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      });
  }, [showErrorAlert]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isDarkMode, isHighContrastMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard);
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal');
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE);
    }
  };

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast);
    setStoredIsHighContrastMode(isHighContrast);
  };

  const clearCurrentRowClass = () => {
    setCurrentRowClass('');
  };

  useEffect(() => {
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guesses]);

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
      const delayMs = REVEAL_TIME_MS * solution.length;

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      });
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, (solution.length + 1) * REVEAL_TIME_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameWon, isGameLost, showSuccessAlert]);

  // character 입력 시 반응 함수
  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      console.log(value);
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  // delete 입력시 반응 함수
  const onDelete = () => {
    console.log('delete!!');
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    );
  };
  // Enter 입력시 반응 함수
  const onEnter = () => {
    console.log('Enter!!');
    // 게임을 이기거나 지면 리턴
    if (isGameWon || isGameLost) {
      return;
    }
    // console.log('currentGuess ::: ' + currentGuess);
    // console.log('currnentRowClass ::: ' + currentRowClass);
    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle');
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      });
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses);
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle');
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        });
      }
    }

    setIsRevealing(true);
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false);
    }, REVEAL_TIME_MS * solution.length);

    const winningWord = isWinningWord(currentGuess);
    // 실제 단어같은 단어만 인지하여 winningWord 판단(solution)
    /** 소켓로직구현
     *1. Enter시  내 턴이 아니면 상대가 Enter 치는 걸 알아야 한다.
          - 
     */
    console.log('winningWord ::: ' + winningWord);
    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      // 답변한 답변들 추가 [...지금까지쳤던단어들, 현재단어]
      setGuesses([...guesses, currentGuess]);
      //
      setCurrentGuess('');
      // 게임 이겼을때
      // if (winningWord) {
      //   if (isLatestGame) {
      //     setStats(addStatsForCompletedGame(stats, guesses.length));
      //   }
      //   return setIsGameWon(true);
      // }
      // 마지막번호까지 입력 한 후에도 실패시 -둘다 실패
      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        }
        setIsGameLost(true);
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * solution.length + 1,
        });
      }
    }
  };
  // 승리 감지
  useEffect(() => {
    if (isRevealing === true) {
      console.log('isRevealing :: true');
      console.log(currentGuess);
      // 단어다운단어를 치면 socket에 담아 보내기
      console.log(roomNumber, [...guesses, currentGuess], userNumber);
      sendMessage({
        roomNum: roomNumber,
        value: currentGuess, // 답변한 답변들 추가 [...지금까지쳤던단어들, 현재단어]
        userNum: userNumber,
      });
      // if (currentGuess === solution) {
      //   Swal.fire({
      //     title: 'You Win',
      //     allowOutsideClick: false,
      //     confirmButtonText: 'OK',
      //   }).then(async (result) => {
      //     // 1. 승수 카운트 1증가 , 2.보상 티켓 카운트 1 증가, 3.route 이동
      //     if (result.isConfirmed === true) {
      //       console.log('성공');
      //       //1-1. 서버 통신
      //       try {
      //         const result = await sendWinCount(address);
      //         //1-2. 서버 통신 실패할 경우
      //         if (result.data.result === false) {
      //           Swal.fire('failed');
      //           navigate('/waiting');
      //         } else {
      //           // state 변경
      //           setWinCount(win_count + 1);
      //         }
      //         // 그냥 서버 통신 자체가 실패할 경우
      //       } catch (err) {
      //         return Swal.fire(`${err}`).then((result) => {
      //           if (result.isConfirmed) {
      //             navigate('/waiting');
      //           } else {
      //             navigate('/waiting');
      //           }
      //         });
      //       }
      //       // 2.보상 티켓 카운트 1 증가 서버 연결
      //       try {
      //         //리워드 티켓 서버에 하나 등록
      //         const result = await sendRewardTicket(address, 1, true);
      //         // 서버 통신 실패할 경우
      //         if (result.data.result === false) {
      //           return Swal.fire('failed');
      //         } else {
      //           // state 변경
      //           setRewardTicket(reward_ticket + 1);
      //           Swal.fire(result.data.msg);
      //           navigate('/waiting');
      //         }
      //         // 서버 실패시
      //       } catch (err) {
      //         return Swal.fire(`${err}`);
      //       }
      //     }
      //   });
      // }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealing]);

  // 로그인 안할경우 리턴
  useEffect(() => {
    if (!isConnected) {
      return navigate('/');
      // 로그인 했을 경우 난이도 설정
    } else {
      // 대기중인 경우
      Swal.fire({
        title: 'choose word length',
        text: 'choose any! haha',
        icon: 'question',
        // showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#5a83aa',
        // cancelButtonColor: '#1c2052',
        denyButtonColor: '#333edd',
        confirmButtonText: '5 length',
        denyButtonText: '6 length',
        // cancelButtonText: '7 length',
        allowOutsideClick: false,
      }).then((result) => {
        // length 5개로 했을때
        if (result.isConfirmed) {
          // 대기방 대기 타이머
          let interval: any;
          // 방 들어가기
          intoRoom(5);
          // 대기목록 관리
          Swal.fire({
            title: 'waiting for another users...',
            allowOutsideClick: false,
            // 로딩창 켜지기(pending이 true일 경우)
            didOpen: () => {
              if (pending) {
                Swal.showLoading();
              }
            },
            // 로딩중이 뜨는 상태
            didRender: () => {
              // pending이 아니라면 닫기
              interval = setInterval(() => {
                if (!pending) {
                  console.log('pending out did render');
                  Swal.close();
                  // Swal.fire('fight!');
                }
              }, 100);
            },
            didClose() {
              clearInterval(interval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss) {
              console.log('pending out!!!');
              clearInterval(interval);
              Swal.fire('fight!');
            }
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, navigate]);

  useEffect(() => {
    // console.log('client userNum ::: ' + userNum);
    if (userNum === 1) {
      // console.log('userNum === ' + userNum);
      setUserNumber(userNum);
    } else if (userNum === 2) {
      // console.log('userNum === ' + userNum);
      // 초기값이 없는 경우에만 할당
      if (userNumber === 0) {
        setUserNumber(userNum);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userNum]);
  useEffect(() => {
    console.log('winnerUser ::: ' + winnerUser);
    if (winning === true) {
      if (winnerUser === userNumber) {
        Swal.fire('You Win!');
      } else {
        Swal.fire('You Lose!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winning]);
  // socket
  useEffect(() => {
    //내가 만든 채팅 서버로부터의 메시지 수신 - pending관리
    socket.on('insert_room', (data) => {
      const result = data;
      if (result.result === 'success') {
        console.log('insert_room result ::: ' + JSON.stringify(result));
        console.log('result.roomNum ' + result.roomNum);
        // 방 넘버
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setRoomNumber(String(result.roomNum));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // temp 업데이트
        setUserNum(result.userNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        console.log('client roomNumber ::: ' + roomNumber);
      }
    });

    //내가 만든 채팅 서버로부터의 메시지 수신 - pending관리
    socket.on('pending', (data) => {
      console.log('pending:::' + JSON.stringify(data));
      // 서버에 두명이 가득찼거나 서버 통신이 성공이라면
      if (data.result === 'success' && data.pending === false) {
        pending = false;
        // 정답 설정
        setSolution(data.answer.toUpperCase());
      } else {
        pending = true;
      }
    });
    //내가 만든 채팅 서버로부터의 메시지 수신 - 답 관리
    socket.on('answer', (data) => {
      console.log('answer:::' + JSON.stringify(data));
      if (data.result === 'success') {
        setGuesses((prev) => {
          return data.value;
        });
      }
      // 답을 맞췄을때
      if (data.result === 'success' && data.gameWin === true) {
        // 보상 주어짐
        // 유저 판별
        setWinnerUser(data.userNum);
        // 이긴지 아닌지 판별
        setWinning(data.gameWin);
        socket.emit('leaveRoom', roomNumber);
      }
    });
    socket.on('turn', (data) => {
      console.log('turn:::' + JSON.stringify(data));
      if (data.result === 'success') {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setUserTurn(data.userTurn);
        console.log('userTurn ::: ' + userTurn);
      }
    });
  }, []);

  // solution 재설정
  useEffect(() => {
    setSolutionGameDate(getRandomDate(new Date(1990, 1, 1), new Date()));
  }, [setSolutionGameDate, solution]);
  console.log(userTurn, userNumber);
  return (
    <Div100vh>
      <div className='flex h-full flex-col mt-4'>
        {/* <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        /> */}

        {!isLatestGame && (
          <div className='flex items-center justify-center'>
            <ClockIcon className='h-6 w-6 stroke-gray-600 dark:stroke-gray-300' />
            <p className='text-base text-gray-600 dark:text-gray-300'>
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className='mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2'>
          {/* 턴, 타이머 */}
          <div className='flex grow flex-col  pb-6 short:pb-2'>
            <div className='flex flex-col justify-center items-center m-10'>
              {solution !== '' && (
                <div className='mb-1'>{!isRevealing && <Timer />}</div>
              )}
              <div className=' flex bg-gray-300	w-3/4 h-8 rounded-md text-center items-center justify-center'>
                <span className='text-red-600'>
                  {userTurn === userNumber ? 'Your turn' : 'Not Your Turn'}
                </span>
              </div>
            </div>

            <Grid
              solution={solution}
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          {userTurn === userNumber ? (
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              solution={solution}
              guesses={guesses}
              isRevealing={isRevealing}
            />
          ) : (
            <></>
          )}
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            solution={solution}
            guesses={guesses}
            gameStats={stats}
            isLatestGame={isLatestGame}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            handleShareFailure={() =>
              showErrorAlert(SHARE_FAILURE_TEXT, {
                durationMs: LONG_ALERT_TIME_MS,
              })
            }
            handleMigrateStatsButton={() => {
              setIsStatsModalOpen(false);
              setIsMigrateStatsModalOpen(true);
            }}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={guesses.length}
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={solutionGameDate}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false);
              setGameDate(d);
            }}
            handleClose={() => setIsDatePickerModalOpen(false)}
          />
          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  );
}

export default App;
