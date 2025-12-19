require('dotenv').config()

class SpaDataBySector {
  
    static getSPADetailBySector = (spa_code, sector, state_code) => {
        console.log('sectore', sector);
        switch (sector) {
            case 'NSC':
                return {"stateCode": 201, "districtCode": 20001, "spa_code": 201+spa_code}
            case 'DADF':
                return {"stateCode": 202, "districtCode": 20002, "spa_code": 202+spa_code}
            case 'HIL':
                return {"stateCode": 203, "districtCode": 20003, "spa_code": 203+spa_code}
            case 'IFFDC':
                return {"stateCode": 204, "districtCode": 20004, "spa_code": 204+spa_code}
            case 'IFFCO':
                return {"stateCode": 205, "districtCode": 20005, "spa_code": 205+spa_code}
            case 'KRIBHCO':
                return {"stateCode": 206, "districtCode": 20006, "spa_code": 206+spa_code}
            case 'KVSSL':
                return {"stateCode": 207, "districtCode": 20007, "spa_code": 207+spa_code}
            case 'NAFED':
                return {"stateCode": 208, "districtCode": 20008, "spa_code": 208+spa_code}
            case 'NDDB':
                return {"stateCode": 209, "districtCode": 20009, "spa_code": 209+spa_code}
            case 'NFL':
                return {"stateCode": 210, "districtCode": 20010, "spa_code": 210+spa_code}
            case 'NHRDF':
                return {"stateCode": 211, "districtCode": 20011, "spa_code": 211+spa_code}
            case 'SOPA':
                return {"stateCode": 212, "districtCode": 20012, "spa_code": 212+spa_code}
            case 'NSAI':
                return {"stateCode": 213, "districtCode": 20013, "spa_code": 213+spa_code}
            case 'PRIVATE':
                return {"stateCode": 213, "districtCode": 20013, "spa_code": 213+spa_code}
            case 'Private':
                return {"stateCode": 213, "districtCode": 20013, "spa_code": 213+spa_code}
            case 'Private Company':
                return {"stateCode": 213, "districtCode": 20013, "spa_code": 213+spa_code}
            case 'BBSSL':
                return {"stateCode": 214, "districtCode": 20014, "spa_code": 214+spa_code}
                
            default:
                return {"stateCode": state_code, "districtCode": 20001, "spa_code": spa_code}
                break
        }

    }
}
module.exports = SpaDataBySector;
