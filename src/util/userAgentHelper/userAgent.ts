export function checkMobile(): string {
  const USER_AGENTS = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if (USER_AGENTS.indexOf('android') > -1) {
    //안드로이드
    return 'android';
  } else if (
    USER_AGENTS.indexOf('iphone') > -1 ||
    USER_AGENTS.indexOf('ipad') > -1 ||
    USER_AGENTS.indexOf('ipod') > -1
  ) {
    //IOS
    return 'ios';
  } else {
    //아이폰, 안드로이드 외
    return 'other';
  }
}
