//获取浏览器相关信息
let $getBrowserInfo = function getBrowserInfo() {
  var agent = navigator.userAgent.toLowerCase();
  // console.log(agent);
  var arr = [];
  var system = agent.split(' ')[1].split(' ')[0].split('(')[1];
  arr.push(system);
  var regStr_edge = /edge\/[\d.]+/gi;
  var regStr_ie = /trident\/[\d.]+/gi;
  var regStr_ff = /firefox\/[\d.]+/gi;
  var regStr_chrome = /chrome\/[\d.]+/gi;
  var regStr_saf = /safari\/[\d.]+/gi;
  var regStr_opera = /opr\/[\d.]+/gi;
  //IE
  if (agent.indexOf("trident") > 0) {
    arr.push(agent.match(regStr_ie)[0].split('/')[0]);
    arr.push(agent.match(regStr_ie)[0].split('/')[1]);
    return arr;
  }
  //Edge
  if (agent.indexOf('edge') > 0) {
    arr.push(agent.match(regStr_edge)[0].split('/')[0]);
    arr.push(agent.match(regStr_edge)[0].split('/')[1]);
    return arr;
  }
  //firefox
  if (agent.indexOf("firefox") > 0) {
    arr.push(agent.match(regStr_ff)[0].split('/')[0]);
    arr.push(agent.match(regStr_ff)[0].split('/')[1]);
    return arr;
  }
  //Opera
  if (agent.indexOf("opr") > 0) {
    arr.push(agent.match(regStr_opera)[0].split('/')[0]);
    arr.push(agent.match(regStr_opera)[0].split('/')[1]);
    return arr;
  }
  //Safari
  if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    arr.push(agent.match(regStr_saf)[0].split('/')[0]);
    arr.push(agent.match(regStr_saf)[0].split('/')[1]);
    return arr;
  }
  //Chrome
  if (agent.indexOf("chrome") > 0) {
    arr.push(agent.match(regStr_chrome)[0].split('/')[0]);
    arr.push(agent.match(regStr_chrome)[0].split('/')[1]);
    return arr;
  } else {
    arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari,IE,Edge!')
    return arr;
  }
}

// 获取操作系统信息
let $getOS = function getOS() {
  var sUserAgent = navigator.userAgent;
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  if (isMac) return "Mac";
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) return "Unix";
  var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  if (isLinux) return "Linux";
  if (isWin) {
    var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
    if (isWin2K) return "Win2000";
    var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
    if (isWinXP) return "WinXP";
    var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
    if (isWin2003) return "Win2003";
    var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
    if (isWinVista) return "WinVista";
    var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
    if (isWin7) return "Win7";
    var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
    if (isWin10) return "Win10";
  }
  return "other";
}

// 获取外网ip信息
// let $getOuterIP = function getOuterIP() {
//   try {
//     return returnCitySN["cip"];
//   } catch {
//     console.log('returnCitySN["cip"]')
//   }
// }
export {
  $getBrowserInfo,
  $getOS
  // $getOuterIP
}