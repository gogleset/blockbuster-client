import { createContext, useState } from 'react';

// context 등록
export const UserContext = createContext({
  nickname: '',
  setNickname: (nickname: string) => {},
  win_count: 0,
  setWinCount: (count: number) => {},
  lose_count: 0,
  setLoseCount: (count: number) => {},
  ticket_count: 0,
  setTicketCount: (count: number) => {},
  reward_ticket: 0,
  setRewardTicket: (count: number) => {},
  stateReset: () => {},
  stateView: () => {},
});

const UserContextProvider = ({ children }: any) => {
  const [nickname, setNickname] = useState('닉네임이 없습니다.');
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [rewardTicket, setRewardTicket] = useState(0);

  const setNicknameHandler = (nickname: string) => setNickname(nickname);
  const setWinCountHandler = (count: number) => setWinCount(count);
  const setLoseCountHandler = (count: number) => setLoseCount(count);
  const setTicketCountHandler = (count: number) => setTicketCount(count);
  const setRewardTicketHandler = (count: number) => setRewardTicket(count);

  function UserContextReset() {
    setNickname('닉네임이 없습니다.');
    setWinCount(0);
    setLoseCount(0);
    setTicketCount(0);
    setRewardTicket(0);
  }

  function viewState() {
    console.log(
      `nickname::: ${nickname}, winCount::: ${winCount}, loseCount:::${loseCount}, ticketCount::: ${ticketCount}, rewardTicket::: ${rewardTicket}`
    );
  }

  return (
    <UserContext.Provider
      // context에 있는 값으로 hook 등록
      value={{
        nickname: nickname,
        setNickname: setNicknameHandler,
        win_count: winCount,
        setWinCount: setWinCountHandler,
        lose_count: loseCount,
        setLoseCount: setLoseCountHandler,
        ticket_count: ticketCount,
        setTicketCount: setTicketCountHandler,
        reward_ticket: rewardTicket,
        setRewardTicket: setRewardTicketHandler,
        stateReset: UserContextReset,
        stateView: viewState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
