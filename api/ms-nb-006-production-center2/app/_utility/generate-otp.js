const generateOTP = () => { 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 5; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 
module.exports = generateOTP

const paginateResponseRaw = (data, page = 1, pageSize = 0, totalRecord=0, lastPage = 1) => (
    {
        current_page: page,
        per_page: pageSize,
        first_page: 1,
        last_page: lastPage,
        total: totalRecord,
        from: totalRecord ? (((page * pageSize) - pageSize) + 1) : 0,
        to: page < lastPage ? (((page * pageSize) - pageSize) + data.length) : (((page * pageSize) - pageSize)) + data.length,
        data: data ? data: [],
    }
);
module.exports = paginateResponseRaw;
