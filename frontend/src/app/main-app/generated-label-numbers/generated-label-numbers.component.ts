import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { BreederService } from 'src/app/services/breeder/breeder.service';
import { RestService } from 'src/app/services/rest.service';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import Swal from 'sweetalert2';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { MasterService } from 'src/app/services/master/master.service';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-generated-label-numbers',
  templateUrl: './generated-label-numbers.component.html',
  styleUrls: ['./generated-label-numbers.component.css'],
})
export class GeneratedLabelNumbersComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent:
    | PaginationUiComponent
    | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  label_number_data = [
    // {
    //   variety_name: 'Aditya ',
    //   lot_number_count: 2,
    //   lot_number: [
    //     {
    //       lot_num: 'Aug-23-0030-01-005',
    //       LotSize: 100,
    //       label_2_count: 2,
    //       label_2: [
    //         {
    //           label_range: '0030/23/B000286-136',
    //           netBag: 100,
    //           netweight: 50,
    //           date_of_test: '11-10-2011',
    //         },
    //         {
    //           label_range: '0030/23/B000286-146',
    //           netBag: 500,
    //           netweight: 10,
    //           date_of_test: '14-10-2011',
    //         },
    //       ],
    //     },

    //     {
    //       lot_num: 'Aug-23-0030-01-006',
    //       LotSize: 29,
    //       label_2_count: 2,
    //       label_2: [
    //         {
    //           label_range: '0030/23/B000286-156',
    //           netBag: 100,
    //           netweight: 29,
    //           date_of_test: '13-10-2011',
    //         },
    //         {
    //           label_range: '0030/23/B000286-166',
    //           netBag: 10,
    //           netweight: 1000,
    //           date_of_test: '23-10-2011',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   variety_name: 'Ankur',
    //   lot_number_count: 2,
    //   lot_number: [
    //     {
    //       lot_num: 'Jul-23-0029-01-005',
    //       LotSize: 100,
    //       label_2_count: 2,
    //       label_2: [
    //         {
    //           label_range: '0030/23/B000286-126',
    //           netBag: 100,
    //           netweight: 50,
    //           date_of_test: '11-10-2011',
    //         },
    //         {
    //           label_range: '0030/23/B000286-146',
    //           netBag: 500,
    //           netweight: 10,
    //           date_of_test: '14-10-2011',
    //         },
    //       ],
    //     },

    //     {
    //       lot_num: 'Jul-23-0029-01-006',
    //       LotSize: 29,
    //       label_2_count: 2,
    //       label_2: [
    //         {
    //           label_range: '0030/23/B000286-156',
    //           netBag: 100,
    //           netweight: 29,
    //           date_of_test: '13-10-2011',
    //         },
    //         {
    //           label_range: '0030/23/B000286-166',
    //           netBag: 10,
    //           netweight: 1000,
    //           date_of_test: '23-10-2011',
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];

  ngForm!: FormGroup;
  fileName = 'Generate-label-number-report.xlsx';
  socials = [
    {
      name: 'Github',
      icon: 'fa fa-github fa-2x',
      link: 'https://www.github.com/..',
    },
    {
      name: 'Twitter',
      icon: 'fa fa-twitter fa-2x',
      link: 'https://www.twitter.com/..',
    },
    {
      name: 'Keybase',
      icon: '',
      link: 'https://keybase.io/..',
    },
  ];

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  lot_numbers;
  dropdownSettings: IDropdownSettings = {};
  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;
  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();
  indentData: any;
  cropGroupDataSecond: any;
  selectCrop_name: any;
  isCropName = false;
  cropDataSecond: any;
  yearOfIndent: any;
  seasonList: any;
  cropGroupList: any;
  cropTypeList: any;
  cropVarietList: any;
  state_cultivation;
  cropGroupListArr = [];
  dataArr = [];
  cropNameValue: any = 'abc';
  finalData: any[];
  selectCrop_variety: any;
  variety_names: any;
  enableTable = false;
  cropNameArrData = [];
  cropname;
  cropVarietListsecond: any;
  spaName: any;
  reportData: any[];
  dummyData;
  tableData;
  grandTotal;
  constructor(
    private breederService: BreederService,
    private fb: FormBuilder,
    private service: SeedServiceService,
    private master: MasterService,
    private router: Router,
    private indentorService: IndenterService
  ) {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_name: [''],
      crop_type: [''],
      variety_name: [''],
      lot_numbers: [''],
    });

    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(
      (newValue) => {
        if (newValue) {
          this.getIndentorSpaSeason(newValue);
          this.ngForm.controls['season'].patchValue('');
          this.ngForm.controls['crop_name'].patchValue('');
          this.ngForm.controls['variety_name'].setValue('');
          this.ngForm.controls['crop_type'].setValue('');
          this.ngForm.controls['variety_name'].setValue('');
          this.ngForm.controls['lot_numbers'].setValue('');
          this.cropVarietListsecond = [];
          this.cropGroupList = [];
          this.cropTypeList = [];
        }
      }
    );
    this.ngForm.controls['season'].valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.getIndentorCropType(newValue);
        this.ngForm.controls['crop_name'].patchValue('');
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['lot_numbers'].setValue('');
        this.cropVarietListsecond = [];
        this.cropGroupList = [];
      }
    });
    this.ngForm.controls['crop_type'].valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.getIndentorCropGroup(newValue);
        this.ngForm.controls['crop_name'].patchValue('');
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['lot_numbers'].setValue('');
        this.cropVarietListsecond = [];
      }
    });
    this.ngForm.controls['crop_name'].valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.getIndentorVariety(newValue);
        this.ngForm.controls['variety_name'].patchValue('');
        this.ngForm.controls['lot_numbers'].setValue('');
      }
    });
  }

  ngOnInit(): void {
    this.yearsData = [];
    this.getIndentorSpaYear();
    this.dropdownSettings = {
      idField: 'crop_code',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
    };

    console.log(this.label_number_data);
  }
  getCropGroupList(newValue) {
    let object = {
      year: Number(this.ngForm.controls['year_of_indent'].value),
      season: newValue,
    };

    this.cropGroupData = [];
    this.breederService
      .postRequestCreator(
        'getCropGroupDataForProducedBreederSeedDetails',
        null,
        object
      )
      .subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          data.EncryptedResponse.data.forEach((element) => {
            this.cropGroupData.push({
              value: element['group_code'],
            });
          });
          this.cropGroupDataSecond = this.cropGroupData;
        }
      });
  }

  getFinancialYear(year) {
    let arr = [];
    arr.push(String(parseInt(year)));
    let last2Str = String(parseInt(year)).slice(-2);
    let last2StrNew = String(Number(last2Str) + 1);
    arr.push(last2StrNew);
    return arr.join('-');
  }

  onSearch() {
    if (
      !this.ngForm.controls['year_of_indent'].value &&
      !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value &&
      !this.ngForm.controls['crop_name'].value &&
      !this.ngForm.controls['variety_name'].value &&
      !this.ngForm.controls['lot_numbers'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    }
    if (
      !this.ngForm.controls['season'].value &&
      !this.ngForm.controls['crop_type'].value
    ) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    }
    if (!this.ngForm.controls['crop_type'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Type.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    }
    if (!this.ngForm.controls['crop_name'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Crop Name.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });

      return;
    }
    if (!this.ngForm.controls['variety_name'].value) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Variety Name.</p>',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#E97E15',
      });
      return;
    } else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      let cropName = this.ngForm.controls['crop_name'].value;
      let varietyDataName = this.ngForm.controls['variety_name'].value;
      let cropNameArr = [];
      this.enableTable = true;
      let varietyNameArr = [];
      for (let i in cropName) {
        cropNameArr.push(
          cropName && cropName[i] && cropName[i].crop_code
            ? cropName[i].crop_code
            : ''
        );
      }
      for (let i in cropName) {
        this.cropNameArrData.push(
          cropName && cropName[i] && cropName[i].crop_name
            ? cropName[i].crop_name
            : ''
        );
      }
      console.log('varietyDataName', varietyDataName);
      for (let i in varietyDataName) {
        varietyNameArr.push(
          varietyDataName && varietyDataName[i] && varietyDataName[i].id
            ? varietyDataName[i].id
            : ''
        );
      }
      this.cropname = this.cropNameArrData.toString();
      const param = {
        search: {
          year: this.ngForm.controls['year_of_indent'].value,
          season: this.ngForm.controls['season'].value,
          crop_type: this.ngForm.controls['crop_type'].value,
          // variety_id: varietyNameArr,
          // crop_code: cropNameArr,
          variety_id:[this.ngForm.controls['variety_name'].value],
          crop_code:[this.ngForm.controls['crop_name'].value],
          type: 'seeddivision',
        },
      };

      this.master
        .postRequestCreator(
          'getIndentorCropWiseBreederSeedindentor',
          null,
          param
        )
        .subscribe((data) => {
          let cropNameArr = [];
          let arr = [];
          let res =
            data && data.EncryptedResponse && data.EncryptedResponse.data
              ? data.EncryptedResponse.data
              : '';
          this.dummyData = res;
          let varietyNameArr = [];

          this.reportData = res;
          this.finalData = res;

          for (let data of this.dummyData) {
            let sum = 0;
            for (let item of data.variety) {
              const uniqueValues = {};
              data.prods = [];

              // Iterate over the array of objects
              item.spas.forEach((obj) => {
                // Check if the current value of "name" property is already in the uniqueValues object
                if (!uniqueValues[obj.name]) {
                  // Add the current value to the uniqueValues object
                  uniqueValues[obj.name] = { ...obj };
                } else {
                  // Sum the "age" property if the value is already present
                  uniqueValues[obj.name].indent_qunatity += obj.indent_qunatity;
                }
              });

              // Convert the uniqueValues object back to an array of objects
              const uniqueArray = Object.values(uniqueValues);
              item.bspcc1 = uniqueValues;
              // Convert the updated array back to JSON
              const result = uniqueArray;
              item.spas = result;

              arr.push(item);
              // if()

              // Step 2: Calculate sum of each JSON object and update the map
            }
          }

          let sum = 0;
          for (let val of this.dummyData) {
            val.prods = [];
            for (let data of val.variety) {
              data.spas.forEach((element) => {
                val.prods.push(element);
              });
              data.spa_count = data.spas.length;

              val.total_spa_count = val.prods.length;
            }

            sum +=
              val && val.crop_total_indent
                ? parseFloat(val.crop_total_indent)
                : 0;
            this.grandTotal = sum ? sum.toFixed(2) : 0;
          }

          console.log(this.grandTotal, 'dummyDsssssssssssssata');
        });

      this.varietyData = [];
      const pageData = [];
    }
  }

  sumArray(a, b) {
    var c = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      c.push((a[i] || 0) + (b[i] || 0));
    }
    return c;
  }
  cropNameList(newValue) {
    let object = {
      year: Number(this.ngForm.controls['year_of_indent'].value),
      season: this.ngForm.controls['season'].value,
      group_code: newValue,
    };

    this.cropData = [];
    this.breederService
      .postRequestCreator(
        'getCropDataForProducedBreederSeedDetails',
        null,
        object
      )
      .subscribe((data: any) => {
        if (data && data.EncryptedResponse && data.EncryptedResponse.data) {
          data.EncryptedResponse.data.forEach((element) => {
            this.cropData.push({
              value: element['crop_code'],
              name: element['m_crop.crop_name'],
            });
            this.cropDataSecond = this.cropData;
          });
        }
      });
  }

  clear() {
    this.ngForm.controls['year_of_indent'].patchValue('');
    this.ngForm.controls['season'].patchValue('');
    this.ngForm.controls['crop_name'].patchValue('');
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['lot_numbers'].setValue('');
    this.cropNameArrData = [];
    this.variety_names = '';
    this.enableTable = false;
    this.seasonList = [];
    this.cropGroupList = [];
    this.cropTypeList = [];
    this.isCropName = false;
    this.varietyData = [];
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
    this.finalData = [];
  }

  myFunction() {
    document.getElementById('myDropdown').classList.toggle('show');
  }

  onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };

  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  download() {
    const name = 'generate-label-number-reports';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      margin: [10, 0, 0, 0],
      html2canvas: {
        dpi: 192,
        scale: 4,
        // width:288,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' },
    };
    html2PDF().set(options).from(element).toPdf().save();
  }
 
  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_name = item && item.name ? item.name : '';
    this.ngForm.controls['crop_name'].setValue(
      item && item.value ? item.value : ''
    );
  }
  getIndentorSpaYear() {
    const data = localStorage.getItem('BHTCurrentUser');
    const userData = JSON.parse(data);
    const param = {
      user_id: userData.id,
      search: {
        type: 'seeddivision',
      },
    };
    this.master
      .postRequestCreator('get-indentor-year-list-second-indentor', null, param)
      .subscribe((data) => {
        this.yearOfIndent =
          data && data.EncryptedResponse && data.EncryptedResponse.data;
      });
  }
  getIndentorSpaSeason(newValue) {
    const param = {
      search: {
        year: newValue,
        type: 'seeddivision',
      },
    };
    this.master
      .postRequestCreator(
        'get-indentor-season-list-second-indentor',
        null,
        param
      )
      .subscribe((data) => {
        this.seasonList =
          data && data.EncryptedResponse && data.EncryptedResponse.data;
      });
  }
  getIndentorCropGroup(newValue) {
    const param = {
      // search:{
      //   season:newValue,
      //   year:this.ngForm.controls['year_of_indent'].value
      // }
      search: {
        crop_type: newValue,
        season: this.ngForm.controls['season'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        type: 'seeddivision',
      },
    };
    this.master
      .postRequestCreator('getindentorCropGrouplistindentor', null, param)
      .subscribe((data) => {
        this.cropGroupList =
          data && data.EncryptedResponse && data.EncryptedResponse.data;
      });
    console.log(this.crop_name, 'hi');
  }
  getIndentorCropType(newValue) {
    const param = {
      search: {
        season: newValue,
        year: this.ngForm.controls['year_of_indent'].value,
        type: 'seedDivision',
      },
    };
    this.master
      .postRequestCreator('getindentorCropTypelistSecondIndentor', null, param)
      .subscribe((data) => {
        this.cropTypeList =
          data && data.EncryptedResponse && data.EncryptedResponse.data;
      });
  }
  getIndentorVariety(newValue) {
    let crop_codeArr = [];
    for (let i in newValue) {
      crop_codeArr.push(newValue[i].crop_code);
    }
    const param = {
      search: {
        crop_type: this.ngForm.controls['crop_type'].value,
        year: this.ngForm.controls['year_of_indent'].value,
        season: this.ngForm.controls['season'].value,
        crop_code: [this.ngForm.controls['crop_name'].value],
        type: 'indenter',
      },
    };
    this.master
      .postRequestCreator('getindentorVarietylistNewIndentor', null, param)
      .subscribe((data) => {
        this.cropVarietList =
          data && data.EncryptedResponse && data.EncryptedResponse.data;
        this.cropVarietListsecond = this.cropVarietList;
      });
    console.log(this.cropVarietListsecond);
  }
  varietyNames(data) {
    this.variety_names = data && data.variety_name ? data.variety_name : '';
    this.ngForm.controls['variety_name'].setValue(
      data && data.variety_code ? data.variety_code : ''
    );
  }
  sss;
  cvClick() {
    document.getElementById('variety_name').click();
  }

  mergeJsonDataByIdAndName(jsonArray1, jsonArray2) {
    const mergedData = {};
    let results = [];

    jsonArray1.forEach((obj) => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    jsonArray2.forEach((obj) => {
      const id = obj.crop_name;
      const name = obj.variety_name;

      if (!mergedData[id]) {
        mergedData[id] = {};
      }

      if (!mergedData[id][name]) {
        mergedData[id][name] = obj;
      }
    });

    return Object.values(mergedData).reduce((result, obj) => {
      results.push(...Object.values(obj));
      return results;
    }, []);
  }

  mapDuplicateData(jsonArray, uniqueKey) {
    const duplicateDataMap = new Map();

    jsonArray.forEach((obj) => {
      const key = obj[uniqueKey];

      if (duplicateDataMap.has(key)) {
        duplicateDataMap.get(key).push(obj);
      } else {
        duplicateDataMap.set(key, [obj]);
      }
    });

    return Array.from(duplicateDataMap.values()).filter(
      (data) => data.length > 0
    );
  }
  mapArraysById(array1, array2) {
    const mappedArray = array1.reduce((result, item) => {
      result[item.crop_name] = {
        ...result[item.crop_name],
        ...item,
      };
      return result;
    }, {});

    return array2.map((item) => ({
      ...item,
      ...mappedArray[item.crop_name],
    }));
  }

  mapArraysByIdAndKey(array1, array2) {
    const mappedArray = array1.reduce((result, item) => {
      result[item] = {
        ...result[item],
        ...item,
      };
      return result;
    }, {});

    return array2.map((item) => ({
      ...item,
      ...mappedArray[item.variety_name],
    }));
  }
  createNestedJSONById(mainArray, nestedArray, idKey, nestedKey) {
    return mainArray.varities.reduce((result, item) => {
      const nestedItems = nestedArray.varities.spaname.filter(
        (nestedItem) => nestedItem[idKey] === item[idKey]
      );
      if (nestedItems.length > 0) {
        item[nestedKey] = nestedItems;
      }
      result.push(item);
      return result;
    }, []);
  }
  getVariety(data) {
    let cropName = [];
    for (let i in data) {
      cropName.push(data[i].name);
    }
    console.log('da', cropName);
    return cropName;
  }
  getRowspan(dataArray: any[], index: number) {
    
  }

  getUniqueData(item) {
    let arr = [];
    for (let itemi in item) {
      arr.push(item[itemi]);
    }
    let newData = [...new Set(arr)];
    return item;
  }
  getCropType(crop_type) {
    console.log('crop_type===',crop_type);
    let unit = crop_type.toLowerCase() === 'agriculture' ? 'Quintal' : 'Kg';
    return unit;
  }
  getCropNamefrommlist(crop) {
    let temp = [];
    crop.forEach((obj) => {
      if (obj.crop_name) {
        temp.push(obj.crop_name);
      }
    });
    return temp.toString().length > 30
      ? temp.toString().substring(0, 30) + '...'
      : temp.toString();
  }
  getVarietyfrommlist(crop) {
    let temp = [];
    crop.forEach((obj) => {
      if (obj.variety_name) {
        temp.push(obj.variety_name);
      }
    });
    return temp.toString().length > 30
      ? temp.toString().substring(0, 30) + '...'
      : temp.toString();
  }

  crop_name_data(crop) {
    let cropName = this.cropGroupList.filter((item) => item.crop_code == crop);
    console.log(cropName);
    return cropName && cropName[0] && cropName[0].crop_name
      ? cropName[0].crop_name
      : 'NA';
  }
  variety_name_data(variety) {
    let varietyName = this.cropVarietListsecond.filter((item) => item.id == variety);
    console.log(varietyName);
    return varietyName && varietyName[0] && varietyName[0].variety_name
      ? varietyName[0].variety_name
      : 'NA';
  }
}
