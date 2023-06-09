import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../store/context';
import { sendLoseCount } from '../../util/send';
import { useAccount } from 'wagmi';
export default function Timer() {
  // 시간을 담을 변수
  const [count, setCount] = useState(600);
  const navigate = useNavigate();
  const { lose_count, setLoseCount } = useContext(UserContext);
  const { address } = useAccount();

  useEffect(() => {
    // 설정된 시간 간격마다 setInterval 콜백이 실행된다.
    const id = setInterval(() => {
      // 타이머 숫자가 하나씩 줄어들도록
      setCount((count) => count - 1);
    }, 1000);

    // 0이 되면 카운트가 멈춤
    if (count === 0) {
      clearInterval(id);
      // 떙알림 처리
      Swal.fire('떙!').then(async (result) => {
        // 확인 누르면
        if (result.isConfirmed) {
          try {
            const result = await sendLoseCount(address);
            console.log(result.data);
            // 서버연결 성공시
            if (result.data.result) {
              setLoseCount(lose_count + 1);
              Swal.fire(`${result.data.msg}`).then(() => {
                return navigate('/waiting');
              });
            } else {
              Swal.fire('서버와의 연결 실패').then(() => {
                return navigate('/waiting');
              });
            }
          } catch (error) {
            Swal.fire(`${error}`).then(() => {
              return navigate('/waiting');
            });
          }
        }
      });
    }

    return () => {
      clearInterval(id);
    };
    // 카운트 변수가 바뀔때마다 useEffecct 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, navigate]);

  return (
    <div>
      <span>{count}</span>
    </div>
  );
}
