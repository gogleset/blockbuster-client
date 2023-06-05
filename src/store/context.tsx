import { createContext, useState } from 'react';

export const UserContext = createContext({
  nickname: '',
  setNickname: (nickname: string) => {},
});

const UserContextProvider = ({ children }: any) => {
  const [nickname, setNickname] = useState('닉네임이 없습니다.');

  const setNicknameHandler = (nickname: string) => setNickname(nickname);
  return (
    <UserContext.Provider
      // context에 있는 값으로 hook 등록
      value={{ nickname: nickname, setNickname: setNicknameHandler }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
