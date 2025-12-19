const generateOTP = () => { 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 5; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 
module.exports = generateOTP


const paginateResponse = (sequelizeResult, page = 1, pageSize = 0) => (
    {
        current_page: page,
        per_page: pageSize,
        first_page: 1,
        last_page: pageSize ? Math.ceil(((Array.isArray(sequelizeResult.count) ? (sequelizeResult.count.length) : sequelizeResult.count) / pageSize)) : 1,
        total: sequelizeResult.count ? (Array.isArray(sequelizeResult.count) ? sequelizeResult.count.length : sequelizeResult.count) : 0,
        from: sequelizeResult.rows && sequelizeResult.rows.length ? ((page * pageSize) - pageSize) + 1 : 0,
        to: sequelizeResult.rows && sequelizeResult.rows.length ? ((page * pageSize) - pageSize) + (sequelizeResult.rows && sequelizeResult.rows.length ? sequelizeResult.rows.length : 0) : 0,
        data: sequelizeResult.rows ? sequelizeResult.rows : [],
    }
);

module.exports = paginateResponse;
