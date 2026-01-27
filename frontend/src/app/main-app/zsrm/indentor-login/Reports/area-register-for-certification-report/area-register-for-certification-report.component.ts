


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
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { IndenterService } from 'src/app/services/indenter/indenter.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ZsrmServiceService } from 'src/app/services/zsrm-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-area-register-for-certification-report',
  templateUrl: './area-register-for-certification-report.component.html',
  styleUrls: ['./area-register-for-certification-report.component.css']
})
export class AreaRegisterForCertificationReportComponent implements OnInit {

  @ViewChild(PaginationUiComponent) paginationUiComponent: PaginationUiComponent | undefined = undefined;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();

  ngForm!: FormGroup;
  fileName = 'Crop-wise-srp-report.xlsx';

  yearsData: any;
  seasonData: any;
  cropGroupData: any;
  cropData: any;
  crop_groups;
  cropListData
  selectCrop_group;
  crop_name_list = []
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  dropdownSettingsCrop: IDropdownSettings = {};
  dropdownSettingsCrop1: IDropdownSettings = {};
  varietyData: any;
  totalIndentedQuantity: any;
  totalProduction: any;
  totalSurplus: any;
  spa_names

  selectedYear: any;
  selectedCropGroup: any;
  selectedCropName: any;
  today = new Date();

  indentData: any;
  cropGroupDataSecond: any;
  selectCrop_name: any;
  isCropName = false;
  cropDataSecond: any;
  inventoryYearData: any = [
    { year: '2026-27', value: '2026-27' },
    { year: '2025-26', value: '2025-26' },
    { year: '2024-25', value: '2024-25' },
    { year: '2023-24', value: '2023-24' },

  ];
  seasonList: any = [
    { season: 'Kharif', value: 'KHARIF' },
    { season: 'Rabi', value: 'RABI' },
    { season: 'Zaid', value: 'ZAID' }
  ];
  cropGroupList: any;
  cropTypeList: any;
  cropVarietList: any;
  state_cultivation:any;
  cropGroupListArr = [];
  dataArr = [];
  finalData: any[];
  sumData: any[];
  selectCrop_variety: any;
  variety_names: any;
  enableTable = false;
  spaName: any;
  cropList = [];
  cropDataList: any[];
  cropVarietListSecond: any;
  cropNameArr: any;
  spa_namesArr: any;
  totalData: any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private zsrmServiceService: ZsrmServiceService,
    private http: HttpClient
  ) {
    this.ngForm = this.fb.group({
      year_of_indent: [''],
      season: [''],
      crop_group: [''],
      crop_name: [''],
      crop_type: [''],
      crop_text: [''],
      name_text: [''],
      variety_name_text: [''],
      variety_name: [''],
      spa_name: [''],


    });
    this.ngForm.controls['crop_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropGroupData = this.cropGroupDataSecond
        let response = this.cropGroupData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropGroupData = response
      }
      else {
        // this.getCropGroupList(this.ngForm.controls['season'].value)
      }
    });

    this.ngForm.controls['name_text'].valueChanges.subscribe(newValue => {
      if (newValue) {
        console.log(newValue)
        this.cropData = this.cropDataSecond;
        let response = this.cropData.filter(x => x.name.toLowerCase().startsWith(newValue.toLowerCase()))
        this.cropData = response
      }
      else {

      }
    });
    this.ngForm.controls['year_of_indent'].valueChanges.subscribe(newValue => {
      if (newValue) {
        // this.getIndentorSpaSeason(newValue)
        this.ngForm.controls['season'].patchValue('');
        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names = ''
        // this.seasonList = [];
        this.cropTypeList = [];
        this.cropNameArr = '';
        this.spa_namesArr = []
        this.selectCrop_group = '';
        this.cropVarietList = []

        this.spa_names = ''
        this.variety_names = '';
        this.enableTable = false;

        this.isCropName = false;

        this.varietyData = []
        this.selectedYear = '';
        this.selectedCropGroup = '';
        this.selectedCropName = '';
        this.finalData = [];
        this.totalData = []
      }

    });
    this.ngForm.controls['season'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCrop(newValue)

        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['crop_type'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names = ''
      }
    });

    this.ngForm.controls['crop_type'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCrop(newValue)

        this.ngForm.controls['crop_group'].patchValue("");
        this.ngForm.controls['crop_name'].patchValue("");
        this.ngForm.controls['variety_name'].setValue('');
        this.ngForm.controls['spa_name'].setValue('');
        this.spa_names = ''
      }
    });

    this.ngForm.controls['spa_name'].valueChanges.subscribe(newValue => {
      if (newValue) {
        this.getIndentorCrop(newValue)
      }
    });
  }

  
  ngOnInit(): void {
    this.yearsData = [];
    // this.getIndentorSpaYear()
    this.dropdownSettings = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'agency_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,

    };
    this.dropdownSettings1 = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'crop_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };

    this.dropdownSettingsCrop = {
      idField: 'id',
      // idField: 'item_id',
      textField: 'agency_name',
      enableCheckAll: true,
      allowSearchFilter: true,
      // itemsShowLimit: 2,
      limitSelection: -1,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
    };


  }

// getSeasonLabel(season: string, year: number): string {
//   console.log(season,season === "kharif","seaon year")
//   // if (!season || !year) return '';
//   const s = season.toLowerCase().trim();
//   if (s === "kharif") {
    
//     return `Kharif (${year})`;
//   }

//   if (s === "rabi") {
//     return `Rabi (${year}-${year + 1})`;
//   }

//   if (s === "zaid") {
//     return `Zaid (${year + 1})`;
//   }

//   return '';
// }
getSeasonLabel(season: string, year: string): string {
  if (!season || !year) return '';

  const s = season.toLowerCase().trim();

  // "2025-26" → 2025, 2026
  let startYear: number;
  let endYear: number;
let part:number;
  if (year.includes('-')) {
    const parts = year.split('-');
    startYear = Number(parts[0]);
    endYear = Number('20' + parts[1]);
     part=Number(parts[1])
  } else {
    startYear = Number(year);
    endYear = startYear + 1;
  }

  if (s === "kharif") {
    return `KHARIF (${startYear})`;       // Kharif (2025)
  }

  if (s === "rabi") {
    return `RABI (${startYear}-${part})`; // Rabi (2025-26)
  }

  if (s === "zaid") {
    return `ZAID (${endYear})`;            // Zaid (2026)
  }

  return '';
}

//   onSearch() {

//     if ((!this.ngForm.controls["year_of_indent"].value)) {
//       Swal.fire({
//         title: '<p style="font-size:25px;">Please Select Something.</p>',
//         icon: 'error',
//         confirmButtonText:
//           'OK',
//         confirmButtonColor: '#E97E15'
//       })

//       return;
//     }
//     if ((!this.ngForm.controls["season"].value)) {
//       Swal.fire({
//         title: '<p style="font-size:25px;">Please Select Season.</p>',
//         icon: 'error',
//         confirmButtonText:
//           'OK',
//         confirmButtonColor: '#E97E15'
//       })

//       return;
//     }

//     else {
//       let searchObject = {};
//       this.selectedYear = 'NA';
//       this.selectedCropGroup = 'NA';
//       this.selectedCropName = 'NA';
//       let crop_name = this.ngForm.controls['crop_name'].value;
//       //  console.log(crop_name)
//       let cropNameArr = [];
//       this.enableTable = true;
//       for (let i in crop_name) {
//         cropNameArr.push(crop_name && crop_name[i] && crop_name[i].id ? crop_name[i].id : '')
//       }

 

// const selectedSeason = this.ngForm.controls["season"].value;
// const selectedYear = this.ngForm.controls["year_of_indent"].value;

// const seasonWithYear = this.getSeasonLabel(selectedSeason, selectedYear);

// // ✅ Direct API URL
// const apiUrl = `https://seedtrace.gov.in/api/getStateWiseRegdAreaForCertification
// ?apiKey=jhgkjKJHKJH7687REZRESDUYIUH098987987FGDETRCbvcdzgvjhkl9
// &year=${selectedYear}
// &season=${seasonWithYear}
// &stateCode=3`;

// // ✅ Direct hit
// this.http.get(apiUrl).subscribe((res: any) => {
//   console.log("API Response:", res);

//    const data = Array.isArray(res) ? res : res.data;

//   if (!Array.isArray(data)) {
//     console.error("API did not return an array", data);
//     return;
//   }
//    const tableData: any[] = [];
// console.log(data,"data")
//   data.forEach((crop: any) => {
//  crop.crop_data.forEach((c:any)=>{
// return{
//   crop_name:c.crop_name,
  
// }


//  })


//     const cropCode = crop.crop_code;

//     crop.spa_data.forEach((spa: any) => {
//       tableData.push({
//         cropCode,
//         cropName,
//         spaCode: spa.spa_code,
//         spaName: spa.spa_name,
//         sector: spa.spa_sector,
//         fsArea: spa.FS_Area,
//         fsQuantity: spa.FS_Quantity,
//         csArea: spa.CS_Area,
//         csQuantity: spa.CS_Quantity
//       });
//     });
//   });
//   console.log(tableData,"tableData")
//   this.varietyData = tableData;
// });
      
//       const pageData = []
//     }
//   }

onSearch(){
  if ((!this.ngForm.controls["year_of_indent"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Something.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }
    if ((!this.ngForm.controls["season"].value)) {
      Swal.fire({
        title: '<p style="font-size:25px;">Please Select Season.</p>',
        icon: 'error',
        confirmButtonText:
          'OK',
        confirmButtonColor: '#E97E15'
      })

      return;
    }

    else {
      let searchObject = {};
      this.selectedYear = 'NA';
      this.selectedCropGroup = 'NA';
      this.selectedCropName = 'NA';
      let crop_name = this.ngForm.controls['crop_name'].value;
      //  console.log(crop_name)
      let cropNameArr = [];
      this.enableTable = true;
      for (let i in crop_name) {
        cropNameArr.push(crop_name && crop_name[i] && crop_name[i].id ? crop_name[i].id : '')
      }

 

const selectedSeason = this.ngForm.controls["season"].value;
const selectedYear = this.ngForm.controls["year_of_indent"].value;

const seasonWithYear = this.getSeasonLabel(selectedSeason, selectedYear);

// ✅ Direct API URL
const apiUrl = `https://seedtrace.gov.in/api/getStateWiseRegdAreaForCertification
?apiKey=jhgkjKJHKJH7687REZRESDUYIUH098987987FGDETRCbvcdzgvjhkl9
&year=${selectedYear}
&season=${seasonWithYear}
&stateCode=3`;



this.http.get(apiUrl).subscribe((res: any) => {
  if(res.statusCode===200)
  {
  const cropArray = res?.data?.[0]?.crop_data;
  if (!Array.isArray(cropArray)) return;

  const tableData: any[] = [];
  let cropCounter = 1;

  // 🔥 GRAND TOTAL variables
  let grandFsArea = 0;
  let grandFsQty = 0;
  let grandCsArea = 0;
  let grandCsQty = 0;

  cropArray.forEach((crop: any) => {

    let totalFsArea = 0;
    let totalFsQty = 0;
    let totalCsArea = 0;
    let totalCsQty = 0;

    const spaList = crop.spa_data || [];

    spaList.forEach((spa: any, index: number) => {

      const fsA = Number(spa.FS_Area.toFixed(2) || 0);
      const fsQ = Number(spa.FS_Quantity.toFixed(2) || 0);
      const csA = Number(spa.CS_Area.toFixed(2) || 0);
      const csQ = Number(spa.CS_Quantity.toFixed(2) || 0);

      totalFsArea += fsA;
      totalFsQty  += fsQ;
      totalCsArea += csA;
      totalCsQty  += csQ;

      tableData.push({
        showCrop: index === 0,
        rowSpan: spaList.length + 1,
        sNo: index === 0 ? cropCounter : '',
        cropName: crop.crop_name,
        spaName: spa.spa_name,
        sector: spa.spa_sector,
        fsArea: fsA,
        fsQuantity: fsQ,
        csArea: csA,
        csQuantity: csQ,
        type: 'spa'
      });
    });

    // ✅ Crop TOTAL row
    tableData.push({
      showCrop: false,
      spaName: 'Total',
      sector: '',
      fsArea: totalFsArea,
      fsQuantity: totalFsQty,
      csArea: totalCsArea,
      csQuantity: totalCsQty,
      type: 'total'
    });

    // 🔥 add into GRAND TOTAL
    grandFsArea += totalFsArea;
    grandFsQty  += totalFsQty;
    grandCsArea += totalCsArea;
    grandCsQty  += totalCsQty;

    cropCounter++;
  });

  // ✅ FINAL GRAND TOTAL ROW (ALL CROPS)
tableData.push({
  showCrop: true,
  rowSpan: 1,
  sNo: '',
  cropName: 'GRAND TOTAL',
  spaName: '',
  sector: '',
  fsArea: grandFsArea,
  fsQuantity: grandFsQty,
  csArea: grandCsArea,
  csQuantity: grandCsQty,
  type: 'grandTotal'
});
  this.varietyData = tableData;
}
else{

}
});

    
}

}
  clear() {
    this.ngForm.controls['year_of_indent'].patchValue("");
    this.ngForm.controls['season'].patchValue("");
    this.ngForm.controls['crop_group'].patchValue("");
    this.ngForm.controls['crop_name'].patchValue("");
    this.ngForm.controls['variety_name'].setValue('');
    this.ngForm.controls['crop_type'].setValue('');
    this.ngForm.controls['spa_name'].setValue('');
    // this.seasonList = [];
    this.cropTypeList = [];
    this.cropNameArr = '';
    this.spa_namesArr = []
    this.selectCrop_group = '';
    this.cropVarietList = []



    this.spa_names = ''
    this.variety_names = '';
    this.enableTable = false;

    this.isCropName = false;

    this.varietyData = []
    this.selectedYear = '';
    this.selectedCropGroup = '';
    this.selectedCropName = '';
    this.finalData = [];
    this.totalData = []
  }

  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  exportexcel(): void {
    let element = document.getElementById('excel-tables');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);

  }

  download() {
    const name = 'Crop-wise-srp-report';
    const element = document.getElementById('excel-table');
    const options = {
      filename: `${name}.pdf`,
      margin: [10, 3, 3, 3],

      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        dpi: 300,
        scale: 2,
        // width:50px,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  cnclick() {
    document.getElementById('crop_name').click();
  }
  crop_name(item: any) {
    this.selectCrop_group = item && item.crop_name ? item.crop_name : '';
    this.ngForm.controls['crop_name'].setValue(item && item.id ? item.id : '')
    console.log(this.ngForm.controls['crop_name'].value, 'item', item)
  }
  // getIndentorSpaYear() {
  //  const route = "get-srp-year";
  //   this.zsrmServiceService.getRequestCreator(route, null, null).subscribe(data => {
  //    if (data.Response.status_code === 200) {
  //      this.yearOfIndent =data && data.Response && data.Response.data ? data.Response.data : '';
  //    } 
  //   })
  // }


  getIndentorCropType(newValue) {
    const queryParams = [];
    const year = this.ngForm.controls['year_of_indent'].value;
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (newValue) queryParams.push(`season=${encodeURIComponent(newValue)}`);
    const apiUrl = `get-srp-croptype?${queryParams.join('&')}`;
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
      console.log(data)
      this.cropTypeList = data && data.Response && data.Response.data ? data.Response.data : '';
    })
  }


  getIndentorCrop(newValue) {
    this.cropList = []
    this.cropVarietList = [];
    const queryParams = [];
    const year = this.ngForm.controls['year_of_indent'].value;
    const season = this.ngForm.controls['season'].value;
    if (year) queryParams.push(`year=${encodeURIComponent(year)}`);
    if (season != 'all') queryParams.push(`season=${encodeURIComponent(season)}`);
    const apiUrl = `get-srp-crop?${queryParams.join('&')}`;
    console.log(apiUrl);
    this.zsrmServiceService.getRequestCreator(apiUrl).subscribe(data => {
      let res = data && data.Response && data.Response.data ? data.Response.data : '';
      res.forEach(element => {
        const temp = {
          crop_name: element.crop_name,
          id: element.crop_code,
        }
        this.cropList.push(temp)
      });
      this.cropVarietList = this.cropList

      console.log("this.cropVarietList", this.cropList);
    })
  }

}
