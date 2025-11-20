class cacheKey {
    static returnkey(key, data) {
        // //console.log(data);
        const keys = {
            "/get-state-list" : "states",
            "/get-city-list" : "cities_list",
            "/get-gender-list": "gender_list",
            "/get-marital-list": "maritalStatus_list",
            "/get-annual-income-list": "annualIncome_list",
            "/get-insurer": `insurer${((data && data.insurancetypeid)?data.insurancetypeid:'')}`,
            "/get-category": `${((data && data.requestFrom)?data.requestFrom:'')}Category`,
            "/get-brand-list": `${ (((data && data.offertype) ? data.offertype : '') + ( ( data && data.parentbrand) ? data.parentbrand : '')) }Brands`,
            "/get-state-city-list": `state_city${(data && data.filter && data.filter.stateid)?data.filter.stateid:0}`,
            "/get-user-source": "knowingSource",
            "/top-spending-category" : `topSpendingCategory${ ( (data && data.userid) ? data.userid : '') }`,
            "/total-annual-premium": `totalAnnualPremium${ ( (data && data.userid) ? data.userid : '') }`,
            "/total-lapsed-policy": `totalLapsedPolicy${ ( (data && data.userid) ? data.userid : '') }`,
            "/lapsed-policy-amount": `lapsedPolicyAmount${ ( (data && data.userid) ? data.userid : '') }`
        }
        return keys[key];
    }
}

module.exports = cacheKey;
