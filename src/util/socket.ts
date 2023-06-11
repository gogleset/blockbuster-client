import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = `${process.env.REACT_APP_DEV_SERVER_ADDRESS}`;

export const socket = io(URL, {});

export function intoRoom(value: number): void {
  console.log('intoRoom');
  const message = {
    length: value,
  };
  // 서버로 메시지 전송
  socket.emit('insert_room', message);
}

// 답변 보내기 함수
export function sendMessage(value: object): void {
  console.log('sendMessage ::: ');
  console.log(value);
  // 서버로 메시지 전송
  // 턴 넘기기
  socket.emit('turn', value);
  // 답 확인
  socket.emit('answer', value);
}
