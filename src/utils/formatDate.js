function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
// module.exports= function formatDate(date) {
//     return (
//       [
//         date.getFullYear(),
//         padTo2Digits(date.getMonth() + 1),
//         padTo2Digits(date.getDate()),
//       ].join('-') +
//       ' ' +
//       [
//         padTo2Digits(date.getHours()),
//         padTo2Digits(date.getMinutes()),
//         padTo2Digits(date.getSeconds()),
//       ].join(':')
//     );
//   }
  
//   // 👇️ 2021-10-24 16:21:23 (yyyy-mm-dd hh:mm:ss)
//   console.log(formatDate(new Date()));
  
//   //  👇️️ 2025-05-04 05:24:07 (yyyy-mm-dd hh:mm:ss)
//   console.log(formatDate(new Date('May 04, 2025 05:24:07')));
module.exports = 
{
  formatDate: (date)=>{
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
  },
  fomatReadableDateOnly: (dateString) => {
    const date = new Date(dateString);

    const optionsDate = {
      month: "short", // abbreviated month name (e.g., Jul)
      day: "2-digit", // two-digit day (e.g., 01)
      year: "numeric", // full year (e.g., 2023)
    };

    const formattedDate = date.toLocaleString("en-US", optionsDate);
    return formattedDate;
  },
  fomatReadableTimeOnly: (dateString) =>{
    const date = new Date(dateString);
    const optionsTime = {
      hour: "numeric", // hour in 12-hour format (e.g., 2 AM)
      minute: "2-digit", // two-digit minute (e.g., 30)
      hour12: true, // use 12-hour format
      timeZone: "Asia/Bangkok", // timezone offset (GMT+7)
    };

    const formattedTime = date.toLocaleString("en-US", optionsTime);
    return formattedTime;
  }
}
  
