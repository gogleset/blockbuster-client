function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// 랜덤한 날짜 출력
function getRandomDate(start: any, end: any) {
  const startDate = start.getTime();
  const endDate = end.getTime();

  return new Date(startDate + Math.random() * (endDate - startDate));
}

// 시작 날짜 ~ 종료 날짜
// getRandomDate(new Date(2022, 1, 1), new Date());

export { rand, getRandomDate };
