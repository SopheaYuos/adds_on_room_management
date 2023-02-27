function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
module.exports= function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  
//   // 👇️ 2021-10-24 16:21:23 (yyyy-mm-dd hh:mm:ss)
//   console.log(formatDate(new Date()));
  
//   //  👇️️ 2025-05-04 05:24:07 (yyyy-mm-dd hh:mm:ss)
//   console.log(formatDate(new Date('May 04, 2025 05:24:07')));
  