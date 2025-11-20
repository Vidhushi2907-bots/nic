import { range } from "src/app/_helpers/utility";

export class FilterPaginateSearch {

    public initialized = false;
    itemListInitial: any[] = [];
    itemList: any[] = [
    //     { "id": 1, "year": "b", "season": "a", "crop": "b", "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 2, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 3, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 4, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 5, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 6, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 7, "variety_name": "PW-247", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" },
    // { "id": 8, "variety_name": "PW-248", "variety_code": "HOASD123", "bspc_developed_by": 1, "req_no_doc_moa": "121212", "req_no_dept_moa": "iiieiieieie", "date_of_reg": "10/11/2023", "ref_no_office_order": "heyeyeyueye", "date_of_office_order": "10/11/2023", "breeder_seed_available": "available" }
    ];
    itemListFilter: any[] = []; 
    itemListTotal: number = 0;
    itemListCurrentPage: number = 0;
    itemListTotalPage: number = 0;
    itemListPrevBtnDisable: boolean = true;
    public itemListPageSize = 50;
    itemListNextBtnDisable: boolean = false;
    parentComponent: any | undefined = undefined;
    actionToGetAllDataName: string | undefined = undefined;
    sourceFilterAction: Function | undefined = undefined;

    paginationArray: any[] = [];
    lastFormSearchValue: { columnNameInItemList: string; value: string; }[] | undefined = undefined;
    dataShouldComeFromAPI: boolean = false;
  seasonListCurrentPage: number;

    constructor() {
    }

    Init(dataList: any[], parentComponent: any, actionToGetAllDataName: string | undefined = undefined, sourceFilterAction: Function | undefined = undefined, totalCount: number | undefined = undefined, dataShouldComeFromAPI: boolean = false) {

        this.dataShouldComeFromAPI = dataShouldComeFromAPI; // false
        this.parentComponent = parentComponent;
        this.actionToGetAllDataName = actionToGetAllDataName;
        this.sourceFilterAction = sourceFilterAction;
        // console.log("dataListdataListdataList", dataList)
        this.itemListInitial = this.itemList = this.itemListFilter = dataList;
        this.filterItemsList(totalCount);
        this.initialized = true;
    }

    paginate(startIndex: number, endIndex: number) {
        this.itemList = this.itemListFilter ? this.itemListFilter.slice(startIndex, endIndex):[];        
        this.paginationArray = [];
        if (!(!this.initialized && this.itemListTotalPage < 2)) {
            let startFrom = this.itemListCurrentPage;
            let endAt = this.itemListTotalPage;
            if (this.itemListCurrentPage > 2) {
                startFrom -= 2;
            }
            if (startFrom + 3 <= this.itemListTotalPage) {
                endAt = startFrom + 3;
            }
            this.paginationArray = range(startFrom, endAt, 1);            
        }
    }

    search(formSearchValue: {
        columnNameInItemList: string,
        value: string
    }[] | undefined): void {
        console.log('formSearchValue',formSearchValue,'columnNameInItemList');
        
        if (!this.initialized) {
            return;
        }
        if (!formSearchValue) {
            
            this.lastFormSearchValue = undefined;
            if (this.parentComponent !== undefined && this.actionToGetAllDataName !== undefined) {
                this.parentComponent[this.actionToGetAllDataName]();
            }
            else {
                this.itemList = this.itemListFilter = this.itemListInitial;
                this.filterItemsList();
            }
            return;
        }

        if (formSearchValue) {
            this.lastFormSearchValue = formSearchValue;
            if (!this.checkAndLoadDataFaromAPI(1)) {
                this.itemList
                    = this.itemListFilter
                    = this.itemListInitial.filter(el => {
                        let matched = true;
                        for (let searchIndex = 0; searchIndex < formSearchValue.length; searchIndex++) {
                            const searchObject = formSearchValue[searchIndex];
                            matched = this.searchTerm(matched, searchObject, el);
                        }
                        return matched;
                    });
            }
        }

        this.filterItemsList();
    }
    searchTerm(matched: boolean, searchObject: { columnNameInItemList: string; value: string; }, el: any): boolean {
        matched = matched && this.getDataFromEl(el, searchObject.columnNameInItemList).toString().toLowerCase().indexOf(searchObject.value.toLowerCase()) > -1;
        if (this.sourceFilterAction) matched = this.sourceFilterAction(el, matched);

        if (matched == null) matched = false;
        return matched;
    }

    getDataFromEl(el: any, columnNameInItemList: string): any {        
        if (columnNameInItemList.indexOf(".") > -1) {
            const columnNameInItemListArr = columnNameInItemList.split(/\.(.*)/);
            return this.getDataFromEl(el[columnNameInItemListArr[0]], columnNameInItemListArr[1]);
        }
        else
            return el[columnNameInItemList];
    }

    filterItemsList(totalCount: number | undefined = undefined) {
        if (totalCount !== undefined) {
            this.itemListTotal = totalCount;
        }
        else {
            this.itemListTotal = this.itemList ? this.itemList.length : 0;
        }
        this.itemListTotalPage = Math.ceil(this.itemListTotal / this.itemListPageSize);
        if (!this.initialized) {
            this.itemListCurrentPage = 1;
            this.itemListPrevBtnDisable = true;
            this.itemListPrevBtnDisable = this.itemListTotalPage && (this.itemListTotalPage == 1) ? true : false;
        }
        this.paginate(0, this.itemListPageSize);
    }

    async navigate(path: string, toPageNumber: number | undefined = undefined) {
        if (!['previous', 'next'].includes(path)) {
            return;
        }
        if (toPageNumber !== undefined) {
            path = 'previous';
            if (typeof toPageNumber === "string")
                toPageNumber = parseInt(toPageNumber);

            if (toPageNumber > this.itemListTotalPage) return;
            this.itemListCurrentPage = toPageNumber + 1;
        }

        if (path === 'previous') {
            if ((this.itemListCurrentPage == 1)) {
                this.itemListPrevBtnDisable = true;
                this.itemListNextBtnDisable = false;
                return;
            }
            else {
                this.itemListPrevBtnDisable = false;
                if (this.itemListCurrentPage >= this.itemListTotalPage) {
                    this.itemListNextBtnDisable = true;
                }
                
            }
            this.itemListCurrentPage--;
            if ((this.itemListPageSize && this.itemListCurrentPage == 1 && (this.itemListCurrentPage == this.itemListTotalPage))) {
                this.itemListNextBtnDisable = false;
                this.itemListPrevBtnDisable = false;
            }
            if((this.itemListCurrentPage == this.itemListTotalPage)){
                this.itemListNextBtnDisable = true;
                this.itemListPrevBtnDisable = false;
            }                
             else if (this.itemListCurrentPage == 1) {
                this.itemListPrevBtnDisable = true;
            }
            else{
                this.itemListNextBtnDisable = false;
            }

            const endIndex = this.itemListPageSize * this.itemListCurrentPage;
            const startIndex = (endIndex - this.itemListPageSize);
            if (!this.checkAndLoadDataFaromAPI()) {
                await this.paginate(startIndex, endIndex);
            }
        }
        if (path === 'next') {
            const startIndex = this.itemListPageSize * this.itemListCurrentPage;
            const endIndex = (startIndex + this.itemListPageSize);
            this.itemListCurrentPage++;

            if (!this.checkAndLoadDataFaromAPI()) {
                await this.paginate(startIndex, endIndex);
            }

            if ((this.itemListPageSize && this.itemListCurrentPage == 1 && (this.itemListCurrentPage == this.itemListTotalPage))) {
                this.itemListNextBtnDisable = false;
                this.itemListPrevBtnDisable = false;
            } else if (this.itemListCurrentPage >= this.itemListTotalPage) {
                this.itemListNextBtnDisable = true;
                this.itemListPrevBtnDisable = false;
                return;
            }
            else {
                this.itemListNextBtnDisable = false;
                if (this.itemListCurrentPage > 1) {
                    this.itemListPrevBtnDisable = false;
                }
            }
        }
    }
    checkAndLoadDataFaromAPI(overrideItemListCurrentPage: number | undefined = undefined): boolean {
        if (this.initialized && this.dataShouldComeFromAPI && this.actionToGetAllDataName) {
            if (overrideItemListCurrentPage !== undefined) {
                this.itemListCurrentPage = overrideItemListCurrentPage;
            }
            this.parentComponent[this.actionToGetAllDataName](this.itemListCurrentPage, this.lastFormSearchValue);
            return true;
        }
        return false;
    }
}