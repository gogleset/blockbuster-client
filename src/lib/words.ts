import { ENABLE_ARCHIVED_GAMES } from '../constants/settings';
import {
  NOT_CONTAINED_MESSAGE,
  WRONG_SPOT_MESSAGE
} from '../constants/strings';
import { VALID_GUESSES } from '../constants/validGuesses6';
import { WORDS } from '../constants/wordlist6';
import { rand, getRandomDate } from '../util/random';
//random 숫자와 random 날짜 리턴
import { getToday } from './dateutils';
import { getGuessStatuses } from './statuses';
import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay
} from 'date-fns';
import { default as GraphemeSplitter } from 'grapheme-splitter';
import queryString from 'query-string';

// 1 January 2022 Game Epoch
export const firstGameDate = new Date(2022, 0);
// console.log(firstGameDate);
export const periodInDays = 1;

export const isWordInWordList = (word: string) => {
  return (
    WORDS.includes(localeAwareLowerCase(word)) ||
    VALID_GUESSES.includes(localeAwareLowerCase(word))
  );
};

export const isWinningWord = (word: string) => {
  console.log(solution);
  return solution === word;
};

// build a set of previously revealed letters - present and correct
// guess must use correct letters in that space and any other revealed letters
// also check if all revealed instances of a letter are used (i.e. two C's)
export const findFirstUnusedReveal = (word: string, guesses: string[]) => {
  if (guesses.length === 0) {
    return false;
  }

  const lettersLeftArray = new Array<string>();
  const guess = guesses[guesses.length - 1];
  const statuses = getGuessStatuses(solution, guess);
  const splitWord = unicodeSplit(word);
  const splitGuess = unicodeSplit(guess);

  for (let i = 0; i < splitGuess.length; i++) {
    if (statuses[i] === 'correct' || statuses[i] === 'present') {
      lettersLeftArray.push(splitGuess[i]);
    }
    if (statuses[i] === 'correct' && splitWord[i] !== splitGuess[i]) {
      return WRONG_SPOT_MESSAGE(splitGuess[i], i + 1);
    }
  }

  // check for the first unused letter, taking duplicate letters
  // into account - see issue #198
  let n;
  for (const letter of splitWord) {
    n = lettersLeftArray.indexOf(letter);
    if (n !== -1) {
      lettersLeftArray.splice(n, 1);
    }
  }

  if (lettersLeftArray.length > 0) {
    return NOT_CONTAINED_MESSAGE(lettersLeftArray[0]);
  }
  return false;
};

export const unicodeSplit = (word: string) => {
  return new GraphemeSplitter().splitGraphemes(word);
};

export const unicodeLength = (word: string) => {
  return unicodeSplit(word).length;
};

export const localeAwareLowerCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleLowerCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toLowerCase();
};

export const localeAwareUpperCase = (text: string) => {
  return process.env.REACT_APP_LOCALE_STRING
    ? text.toLocaleUpperCase(process.env.REACT_APP_LOCALE_STRING)
    : text.toUpperCase();
};
// 게임 날짜 랜덤수정
export const getLastGameDate = (today: Date) => {
  // const t = startOfDay(today);
  // console.log(t);
  // console.log(differenceInDays(firstGameDate, t));
  // const daysSinceLastGame = differenceInDays(firstGameDate, t) % periodInDays;
  // console.log(daysSinceLastGame);
  // console.log(getRandomDate(new Date(1990, 1, 1), new Date()));
  // return addDays(t, -daysSinceLastGame);
  return getRandomDate(new Date(1990, 1, 1), new Date());
};

export const getNextGameDate = (today: Date) => {
  return addDays(getLastGameDate(today), periodInDays);
};

export const isValidGameDate = (date: Date) => {
  if (date < firstGameDate || date > getToday()) {
    return false;
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0;
};

// word배열 인덱스 결정
export const getIndex = (gameDate: Date) => {
  console.log(gameDate);
  let start = firstGameDate;
  let index = -1;

  do {
    // 인덱스
    index++;
    start = addDays(start, periodInDays);
    // start가 gamedate보다 낮으면
  } while (start <= gameDate);

  return index;
};

// 날짜 word 출력 실제 solution에 접근하는 함수
export const getWordOfDay = (index: number) => {
  console.log(`getWordOfDay index::: ${index}`);
  if (index < 0) {
    throw new Error('Invalid index');
  }

  return localeAwareUpperCase(WORDS[index % WORDS.length]);
};

export const getSolution = (gameDate: Date) => {
  const nextGameDate = getNextGameDate(gameDate);
  //words의 index에 랜덤하게 접근
  const index = rand(1, 20000); //getIndex(gameDate);
  console.log(index);
  const wordOfTheDay = getWordOfDay(index);
  return {
    solution: wordOfTheDay,
    solutionGameDate: gameDate,
    solutionIndex: index,
    tomorrow: nextGameDate.valueOf(),
  };
};

// 리턴하는건 오늘의 날짜
export const getGameDate = () => {
  // console.log(getToday());
  if (getIsLatestGame()) {
    return getToday();
  }

  const parsed = queryString.parse(window.location.search);
  try {
    const d = startOfDay(parseISO(parsed.d!.toString()));
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday());
    }
    return d;
  } catch (e) {
    console.log(e);
    return getToday();
  }
};

export const setGameDate = (d: Date) => {
  try {
    if (d < getToday()) {
      window.location.href = '/?d=' + formatISO(d, { representation: 'date' });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  window.location.href = '/';
};

export const getIsLatestGame = () => {
  if (!ENABLE_ARCHIVED_GAMES) {
    return true;
  }
  const parsed = queryString.parse(window.location.search);
  return parsed === null || !('d' in parsed);
};

export let { solution, solutionGameDate, solutionIndex, tomorrow } =
  getSolution(getGameDate());

export function restart() {
  return getSolution(getGameDate());
}
