import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Timer() {
  // 시간을 담을 변수
  const [count, setCount] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      Swal.fire('떙!').then(() => {
        navigate('/waiting');
      });
    }
  }, [count, navigate]);

  useEffect(() => {
    // 설정된 시간 간격마다 setInterval 콜백이 실행된다.
    const id = setInterval(() => {
      // 타이머 숫자가 하나씩 줄어들도록
      setCount((count) => count - 1);
    }, 1000);

    // 0이 되면 카운트가 멈춤
    if (count === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
    // 카운트 변수가 바뀔때마다 useEffecct 실행
  }, [count]);

  return (
    <div>
      <span>{count}</span>
    </div>
  );
}
