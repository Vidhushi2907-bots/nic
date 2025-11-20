import { Component,OnInit,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormArray,FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs; 
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-crop-group-detail',
  templateUrl: './crop-group-detail.component.html',
  styleUrls: ['./crop-group-detail.component.css']
})
export class CropGroupDetailComponent implements OnInit {
  currentLevel: 'group' | 'crop' | 'variety' | 'final' = 'group';
  ngFrom!: FormGroup;
  showExportOptions = false;
  cropGroupWiseDataList: any[] = []; crops: any[] = []; 
  varieties: any[] = [];   
  showVarieties: boolean = false;
  selectedCrop: any = null;
  totalCrops: number = 0;
   variety_code: string = '';
  selected_variety_name: string = '';
  
  cropWiseDataList: any[] = [];
  varietyWiseDataList: any[] = [];
  varietyWiseDataListForExcel: any[] = [];
  notificationYears: number[] = [];
  state_code= null;
  group_code= null;
  crop_code= null;
  allCropWiseDataList: any[] = [];
  
  varietyFieldDropdown: any[] = [];
dropdownSettings: any = {};
  total_crop_count= 0;
  total_crop_group_count = 0;
 
  total_variety_count= 0;
  selected_group= '';
  showFilterSection = false;
  fieldList: any[] = []; 

  selected_crop_name = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  groupColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Total Crop Count", dbColumnName: "total_crop_count", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  cropColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  varietyColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 20 },
    { name: "Variety Name", dbColumnName: "variety_name", width: 20 },
    { name: "Notification Date", dbColumnName: "notification_date", width: 20 },
    { name: "Notification Number", dbColumnName: "notification_number", width: 20 },
  ];
  varietyColumnsForExcel = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "State Name", dbColumnName: "state_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 25 },
    { name: "Variety Name", dbColumnName: "variety_name", width: 25 },
    { name: "Meeting Number", dbColumnName: "meeting_number", width: 25 },
    { name: "Notification Date", dbColumnName: "notification_date", width: 25 },
    { name: "Notification Number", dbColumnName: "notification_number", width: 25 },
    { name: "Introduction Year", dbColumnName: "year_of_introduction", width: 25 },
    { name: "Recommended State(s) for Cultivation", dbColumnName: "states_for_cultivation", width: 25 },
    { name: "Types of Maturity", dbColumnName: "maturity_name", width: 25 },
    { name: "Generic Morphological Characteristics", dbColumnName: "generic_morphological", width: 25 },
    { name: "Specific Morphological Characteristics", dbColumnName: "specific_morphological", width: 25 },
    { name: "Average Yield (Kg/Ha)", dbColumnName: "average_yeild_from", width: 25 },
    { name: "Adaptation and Recommended Ecology", dbColumnName: "adoptation_ecology", width: 25 },
    { name: "Agronomic Feature", dbColumnName: "agronomic_features", width: 25 },
    { name: "Reaction to Major Diseases", dbColumnName: "reaction_major_diseases", width: 25 },
    { name: "Reaction to Major Pests", dbColumnName: "reaction_insect_pests", width: 25 },
    { name: "Fertiliser Dosage(Kg/Ha)", dbColumnName: "fertilizer_dosage", width: 25 },
    { name: "Status", dbColumnName: "is_active", width: 25 },
  ];

  constructor(private fb: FormBuilder, private service: SeedServiceService) {
    this.createForm();
  }



ngOnInit(): void {
  this.currentLevel = 'group';
  this.loadVarietyFields();
  // this.getCropGroupWiseList();
  this.getCropGroupWiseList(true);

  // Dropdown fields
  this.varietyFieldDropdown = [
    { item_id: 1, item_text: 'Crop Code', field_key: 'crop_code' },
    { item_id: 2, item_text: 'Variety Code', field_key: 'variety_code' },
    { item_id: 3, item_text: 'Variety Name', field_key: 'variety_name' },
    { item_id: 4, item_text: 'Notification Number', field_key: 'notification_number' },
    { item_id: 5, item_text: 'Notification Date', field_key: 'notification_date' },
    { item_id: 6, item_text: 'Group Name', field_key: 'group_name' },
    { item_id: 7, item_text: 'Crop Name', field_key: 'crop_name' }
  ];

  this.dropdownSettings = {
    idField: 'field_key',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  // initialize form once
  this.createForm();

  this.getNotificationYears();
  this.fetchTotalCrops();

  // default year selects
  this.ngFrom.patchValue({
    year_from: 'ALL',
    year_to: 'ALL'
  });
 this.ngFrom.valueChanges.subscribe(() => { if (this.currentLevel === 'group') { this.getCropGroupWiseList(); } else if (this.currentLevel === 'crop') { this.getCropWiseList(this.group_code); } else { this.getVarietyWiseList(this.group_code, this.crop_code); } });
  // single subscription already inside createForm() handles valueChanges
}


createForm() {
    this.ngFrom = this.fb.group(
      {
        filed_data: new FormControl([]),
        year_from: 'ALL',
        year_to: 'ALL',
        group_code_search_filter: '',
        crop_search_filter: '',
        variety_search_filter: '',
        global_search: ''
      },
      { validators: this.yearRangeValidator }
    );

    // Single subscription for all filters
    this.ngFrom.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

    yearRangeValidator(group: FormGroup) {
    const from = group.get('year_from')?.value;
    const to = group.get('year_to')?.value;

    if (from && to && from !== 'ALL' && to !== 'ALL' && +from > +to) {
      return { yearRangeInvalid: true };
    }
    return null;
  }

loadVarietyFields() {
  this.varietyFieldDropdown = [
    { item_id: 1, item_text: 'Crop Code', field_key: 'crop_code' },
    { item_id: 2, item_text: 'Variety Code', field_key: 'variety_code' },
    { item_id: 3, item_text: 'Variety Name', field_key: 'variety_name' },
    { item_id: 4, item_text: 'Notification Number', field_key: 'notification_number' },
    { item_id: 5, item_text: 'Notification Date', field_key: 'notification_date' },
    { item_id: 6, item_text: 'Group Name', field_key: 'group_name' },
    { item_id: 7, item_text: 'Crop Name', field_key: 'crop_name' }
  ];

  this.ngFrom.patchValue({
    filed_data: this.varietyFieldDropdown
  });
}
loadVarietyWiseData() {
  const payload = {
    group_code: this.group_code,
    crop_code: this.crop_code || '',
    year_from: this.ngFrom.value.year_from,
    year_to: this.ngFrom.value.year_to,
    search_filter: this.ngFrom.value.variety_search_filter || ''
  };

  this.service.postRequestCreator('get-data-variety-wise-report-one', payload)
    .subscribe((res: any) => {
      console.log("API Response ===>", res.data);
      this.varietyWiseDataList = res.data || [];
    });
}
  applyYearFilter() {
  const fromYear = this.ngFrom.get('year_from')?.value;
  const toYear = this.ngFrom.get('year_to')?.value;


  const payloadFrom = fromYear === "ALL" ? '' : fromYear;
  const payloadTo = toYear === "ALL" ? '' : toYear;

  this.ngFrom.patchValue({
    year_from: payloadFrom,
    year_to: payloadTo
  }, { emitEvent:true });

  if (this.currentLevel === 'group') {
    this.getCropGroupWiseList();
  } else if (this.currentLevel === 'crop') {
    this.getCropWiseList(this.group_code);
  } else {
    this.getVarietyWiseList(this.group_code, this.crop_code);
  }
}

getCropGroupWiseList(initialLoad: boolean = false) {
  this.currentLevel = 'group';

  const searchKeyword = String(this.ngFrom.get('global_search')?.value || '').trim().toLowerCase();

  this.service.postRequestCreator('get-data-group-code-wise-report-one', '', {})
    .subscribe({
      next: (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200) {
          let allData = res?.EncryptedResponse?.data?.data || [];

          // Filter logic (any column match)
          this.cropGroupWiseDataList = allData.filter((row: any) => {
            return (
              String(row.group_name || '').toLowerCase().includes(searchKeyword) ||
              String(row.total_crop_count || '').toLowerCase().includes(searchKeyword) ||
              String(row.total_variety_count || '').toLowerCase().includes(searchKeyword)
            );
          });

          this.selected_group = this.cropGroupWiseDataList[0]?.group_name;
          this.group_code = this.cropGroupWiseDataList[0]?.group_code;

          if (initialLoad) {
            this.total_crop_count = res?.EncryptedResponse?.data?.total_crop_count;
            this.total_variety_count = res?.EncryptedResponse?.data?.total_variety_count;
            this.total_crop_group_count = this.cropGroupWiseDataList?.length;
          }

          this.fetchTotalCrops();
        } else {
          this.cropGroupWiseDataList = [];
          if (!initialLoad) {
            Swal.fire('No data found', '', 'warning');
          }
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        Swal.fire('Error', 'Data not get by us', 'error');
      }
    });
}


  
  toggleFilter() {
    this.showFilterSection = !this.showFilterSection;
  }


onFieldSelect(selectedFields:any) {
  const fieldArray = this.ngFrom.get('filed_data') as FormArray;
  fieldArray.clear();

  selectedFields.forEach(field => {
    fieldArray.push(this.fb.group({
      field_key: [field.field_key],
      field_label: [field.field_label]
    }));
  });

  console.log("Selected Fields ===>", fieldArray.value);
}


// getVarietyWiseList(group_code: any, crop_code: any) {
//   this.currentLevel = 'variety';
//   this.group_code = group_code;
//   this.crop_code = crop_code;

//   const payload = {
//     search: {
//       search_filter: String(this.ngFrom.get('variety_search_filter')?.value || '').trim(),
//       year_from: this.ngFrom.value.year_from === 'ALL' ? '' : this.ngFrom.value.year_from,
//       year_to: this.ngFrom.value.year_to === 'ALL' ? '' : this.ngFrom.value.year_to,
//       group_code: group_code || '',
//       crop_code: crop_code || ''
//     }
//   };

//   console.log('getVarietyWiseList payload =>', payload);

//   this.service.postRequestCreator('get-data-variety-wise-report-one', null, payload)
//     .subscribe({
//       next: (res: any) => {
//         console.log('Variety API response =>', res);
//         if (res?.EncryptedResponse?.status_code === 200) {
//           this.varietyWiseDataList = res?.EncryptedResponse?.data || [];
//           this.selected_crop_name = (this.varietyWiseDataList[0]?.crop_name) || '';
//         } else {
//           this.varietyWiseDataList = [];
//           this.selected_crop_name = '';
//           console.log('No variety data found for payload');
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching variety data:', err);
//         this.varietyWiseDataList = [];
//         this.selected_crop_name = '';
//       }
//     });
// }


getVarietyWiseList(group_code: any, crop_code: any) {
  this.currentLevel = 'variety';
  this.group_code = group_code;
  this.crop_code = crop_code;

  const searchKeyword = String(this.ngFrom.get('global_search')?.value || '').trim().toLowerCase();

  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('variety_search_filter')?.value || '').trim(),
      year_from: this.ngFrom.value.year_from === 'ALL' ? '' : this.ngFrom.value.year_from,
      year_to: this.ngFrom.value.year_to === 'ALL' ? '' : this.ngFrom.value.year_to,
      group_code: group_code || '',
      crop_code: crop_code || ''
    }
  };

  console.log('getVarietyWiseList payload =>', payload);

  this.service.postRequestCreator('get-data-variety-wise-report-one', null, payload)
    .subscribe({
      next: (res: any) => {
        console.log('Variety API response =>', res);
        if (res?.EncryptedResponse?.status_code === 200) {
          const allData = res?.EncryptedResponse?.data || [];

          // Filtered data
          this.varietyWiseDataList = allData.filter((row: any) => {
            return (
              String(row.group_name || '').toLowerCase().includes(searchKeyword) ||
              String(row.crop_name || '').toLowerCase().includes(searchKeyword) ||
              String(row.variety_name || '').toLowerCase().includes(searchKeyword) ||
              String(row.notification_number || '').toLowerCase().includes(searchKeyword) ||
              String(row.notification_date || '').toLowerCase().includes(searchKeyword) 
            );
          });

          this.selected_crop_name = this.varietyWiseDataList[0]?.crop_name || '';
        } else {
          this.varietyWiseDataList = [];
          this.selected_crop_name = '';
          console.log('No variety data found for payload');
        }
      },
      error: (err) => {
        console.error('Error fetching variety data:', err);
        this.varietyWiseDataList = [];
        this.selected_crop_name = '';
      }
    });
}




  
  searchFilter(buttonType: any) {
  if (this.ngFrom.invalid) {
    this.ngFrom.markAllAsTouched(); 
    return;
  }

  if (buttonType == 'group') {
    this.getCropGroupWiseList();
  } else {
    this.getVarietyWiseList(this.group_code, this.crop_code);
  }
}





  goBack() {
    this.currentLevel= 'group';
    this.state_code= null;
    this.group_code= null;
    this.crop_code= null;
    this.ngFrom.reset({
      year_to: '',
      year_from: '',
    });
    this.getCropGroupWiseList();
  }

  resetFilter(buttonType: any) {
    this.ngFrom.reset({
      year_to: '',
      year_from: '',
    });

    if(buttonType == 'group'){
      this.currentLevel= 'group';
      this.getCropGroupWiseList();
    } else {
      this.currentLevel= 'variety';
      this.getVarietyWiseList(this.group_code,this.crop_code);
    }
  }

  

  getNotificationYears() {
      this.service.postRequestCreator('get-year-from-variety', null, null)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 ) {
            this.notificationYears = ["ALL", ...data]; 
          } else {
            this.notificationYears=[];
            console.log('Crop List Data not found.');
          }
        },
        (err) => {
          console.error('Error fetching Crop List data:', err);
        }
      );
  }

  async downloadExcel(pageType: any,isShowFilter: any) {
      let fileName: string;
      let title: string;
      let excelColumns: any;
      let data: any;
      this.showExportOptions = false;
      if (pageType === 'group') {
        fileName = 'Group_wise_statistics';
        title = 'Crop Group Wise Statistics';
        excelColumns = this.groupColumns;
        data = this.cropGroupWiseDataList;
      } else if (pageType === 'crop') {
        fileName = 'Crop_wise_statistics';
        title = 'Crop Wise Statistics';
        excelColumns = this.cropColumns;
        data = this.cropWiseDataList;
      } else {
        this.getVarietyDetailForExcel();
        await new Promise(resolve => setTimeout(resolve, 2500)); 
        fileName = 'Variety_wise_statistics';
        title = 'Variety Wise Statistics';
        excelColumns = this.varietyColumnsForExcel;
        data = this.varietyWiseDataListForExcel;
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title);
  
      worksheet.mergeCells('A1:D1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = title;
      titleCell.font = { name: 'Poppins', size: 14, bold: true };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' }
      };
      titleCell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
  
    const fromYear = this.ngFrom.get('year_from')?.value || 'NA';
    const toYear = this.ngFrom.get('year_to')?.value || 'NA';
    let searchKeyword = 'NA';

    if (pageType === 'group') {
      searchKeyword = this.ngFrom.get('group_code_search_filter')?.value || 'NA';
    } else if (pageType === 'crop') {
      searchKeyword = this.ngFrom.get('crop_search_filter')?.value || 'NA';
    } else {
      searchKeyword = this.ngFrom.get('variety_search_filter')?.value || 'NA';
    }

      if (isShowFilter) {
        worksheet.addRow(['', 'From Notification Year', 'To Notification Year', 'Search Keyword']);
        worksheet.addRow(['', fromYear, toYear, searchKeyword]);
        worksheet.addRow([]);
      } else {
        worksheet.addRow(['','Search Keyword']);
        worksheet.addRow(['', searchKeyword]);
        worksheet.addRow([]);
      }
      const header = excelColumns.map(x => x.name);
      const headerRow = worksheet.addRow(header);
      headerRow.font = { name: 'Poppins', size: 11, bold: true };
      headerRow.height = 30;
  
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '6F6A6A' }
        };
        cell.font = { name: 'Poppins', color: { argb: 'FFFFFF00' }, size: 11, bold: true };
        cell.border = {
          top: { style: 'thick' },
          left: { style: number === 1 ? 'thick' : 'thin' },
          bottom: { style: 'thin' },
          right: { style: number === header.length ? 'thick' : 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
  
    
      excelColumns.forEach((x, i) => {
        if (x.width) {
          worksheet.getColumn(i + 1).width = x.width;
        }
      });
  
      data.forEach((rowData: any, dataIndex: number) => {
        const generateRow = excelColumns.map(x => {
          if (x.isIndex) return dataIndex + 1;
          const value = x.dbColumnName && rowData[x.dbColumnName] ? rowData[x.dbColumnName] : '';
          if(x.dbColumnName === 'notification_date'){
           return this.formatDate(value);
          } else if(x.dbColumnName === 'states_for_cultivation'){
             return value && value.map((s: { state_name: any; }) => s.state_name).join(', ')
          } else if(x.dbColumnName === 'reaction_major_diseases'){
            return value && value.map((s: { name: any; }) => s.name).join(', ')
          } else if(x.dbColumnName === 'reaction_insect_pests'){
             return value && value.map((s: { name: any; }) => s.name).join(', ')
          } else if(x.dbColumnName === 'is_active'){
             return value && value == 1 ?'ACTIVE':'INACTIVE';
          } else {
             return value || 'NA';
          }
        });
        const row = worksheet.addRow(generateRow);
        row.height = 25;
        row.eachCell((cell, number) => {
          if (number <= header.length) {
            cell.border = {
              top: { style: 'thin' },
              left: { style: number === 1 ? 'thick' : 'thin' },
              bottom: { style: 'thick' },
              right: { style: number === header.length ? 'thick' : 'thin' }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });
      });
  
  
      try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, fileName);
      } catch (error) {
        console.error('Error generating Excel:', error);
      }
  }
getVarietyAgeColor(notificationDate: string | null | undefined): string {
  if (!notificationDate) {
    return 'white'; 
  }

  const currentYear = new Date().getFullYear();
  const notifYear = new Date(notificationDate).getFullYear();

  if (isNaN(notifYear)) {
    return 'white';
  }

  const age = currentYear - notifYear;

  if (age < 5) {
    return 'lightgreen';
  } else if (age >= 5 && age <= 10) {
    return 'lightyellow';
  } else {
    return '#f5f5f5';
  }
}



  async downloadPdf(pageType: any,isShowFilter: any) {
    let fileName: string;
    let title: string;
    let pdfColumns: any;
    let data: any;
    this.showExportOptions = false;

    if (pageType === 'group') {
      fileName = 'Group_wise_statistics.pdf';
      title = 'Crop Group Wise Statistics';
      pdfColumns = this.groupColumns;
      data = this.cropGroupWiseDataList;
    } else if (pageType === 'crop') {
      fileName = 'Crop_wise_statistics.pdf';
      title = 'Crop Wise Statistics';
      pdfColumns = this.cropColumns;
      data = this.cropWiseDataList;
    } else {
      fileName = 'Variety_wise_statistics.pdf';
      title = 'Variety Wise Statistics';
      pdfColumns = this.varietyColumns;
      data = this.varietyWiseDataList;
    }

    const header = pdfColumns.map((x: any) => x.name);
    const widths = header.length <= 5 ? Array(header.length).fill('*') : Array(header.length).fill('auto');

    const fromYear = this.ngFrom.get('year_from')?.value || 'NA';
    const toYear = this.ngFrom.get('year_to')?.value || 'NA';
    let searchKeyword = 'NA';
    if (pageType === 'group') {
      searchKeyword = this.ngFrom.get('group_code_search_filter')?.value || ' NA';
    } else if (pageType === 'crop') {
      searchKeyword = this.ngFrom.get('crop_search_filter')?.value || ' NA';
    } else {
      searchKeyword = this.ngFrom.get('variety_search_filter')?.value || ' NA';
    }

    //  Data rows
    const body = data.map((item: any, index: number) => {
      return pdfColumns.map((col: any) => {
        if (col.isIndex) return index + 1;
        let value = item[col.dbColumnName] || '';
        if (col.dbColumnName === 'notification_date') {
          return this.formatDate(value);
        }
        return value;
      });
    });

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 20, 10, 20],
      content: [
        {
          text: title,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        // Conditional filter section
        ...(isShowFilter
          ? [
              {
                table: {
                  widths: ['auto', 'auto', '*', ...Array(header.length - 3).fill('auto')],
                  body: [
                    [
                      { text: 'From Notification Year', bold: true },
                      { text: 'To Notification Year', bold: true },
                      { text: 'Search Keyword', bold: true },
                      ...Array(header.length - 3).fill('')
                    ],
                    [
                      fromYear,
                      toYear,
                      searchKeyword,
                      ...Array(header.length - 3).fill('')
                    ]
                  ]
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 10]
              }
            ]
          : [
              {
                table: {
                  widths: ['auto', '*', ...Array(header.length - 2).fill('auto')],
                  body: [
                    [
                      { text: 'Search Keyword', bold: true },
                      ...Array(header.length - 1).fill('')
                    ],
                    [
                      searchKeyword,
                      ...Array(header.length - 1).fill('')
                    ]
                  ]
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 10]
              }
            ]),
        // Actual data table
        {
          table: {
            headerRows: 1,
            widths: widths,
            body: [header, ...body]
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? '#6F6A6A' : null;
            },
            hLineColor: () => '#aaa',
            vLineColor: () => '#aaa',
            paddingLeft: () => 2,
            paddingRight: () => 2,
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          color: '#E97E15'
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white'
        }
      }
    };
    pdfMake.createPdf(docDefinition).download(fileName);
  }
viewVarietyDetail(rowData: any) {

  if (this.ngFrom.value.filed_data && this.ngFrom.value.filed_data.length > 0) {
    Swal.fire({
     title: 'View Variety Characteristics',
      html: `
        <div class="variety-details">
        
          <!-- Column 1 -->
          <div class="col">
            <div class="field"><label>Crop Group/Crop Category</label><div class="value">--</div></div>
            <div class="field"><label>Botanical/Scientific Name</label><div class="value">--</div></div>
            <div class="field"><label>Variety Name</label><div class="value">--</div></div>
            <div class="field"><label>Notified / Non-Notified</label><div class="value">--</div></div>
            <div class="field"><label>Notification Number</label><div class="value">--</div></div>
            <div class="field"><label>Year of Release</label><div class="value">--</div></div>
            <div class="field"><label>Category</label><div class="value">--</div></div>
          </div>

          <!-- Column 2 -->
          <div class="col">
            <div class="field"><label>Crop Name</label><div class="value">--</div></div>
            <div class="field"><label>Crop Name (Hindi)</label><div class="value">--</div></div>
            <div class="field"><label>Variety Code</label><div class="value">--</div></div>
            <div class="field"><label>Notification Date</label><div class="value">--</div></div>
            <div class="field"><label>Meeting Number</label><div class="value">--</div></div>
            <div class="field"><label>Select Type</label><div class="value"><span class="badge" style="background:#b3e6ff;padding:4px 10px;border-radius:10px;">NA<span></div></div>
            <div class="field"><label>category</label><div class="value"><span class="badge" style="background:#e0b3f1;padding:4px 10px;border-radius:10px;">NA<span></div></div>
          </div>

          <!-- Column 3 -->
          <div class="col">
            <div class="field"><label>Developed By</label><div class="value">--</div></div>
            <div class="field"><label>Recommended State(s) for Cultivation</label><div class="value">--</div></div>
            <div class="field"><label>Agro-Ecological Regions</label><div class="value">--</div></div>
            <div class="field"><label>Type of Maturity</label><div class="value">--</div></div>
            <div class="field"><label>Enter Maturity (in Days)</label><div class="value">--</div></div>
            <div class="field"><label>Average Yield (Qt/Ha)</label><div class="value">--</div></div>
            <div class="field"><label>Climate Resilience</label><div class="value">><span class="badge" style="background:#f0f0f0;padding:4px 10px;border-radius:10px;">NA<span></div></div>
          </div>

          <!-- Column 4 -->
          <div class="col">
            ${this.ngFrom.value.filed_data.map((field: any) => `
              <div class="field">
                <label>${field.item_text}</label>
                <div class="value">${rowData[field.field_key] || 'NA'}</div>
              </div>
            `).join('')}
          </div>

        </div>
      `,
      confirmButtonText: 'Close',
      width: 1200,
      customClass: { confirmButton: 'custom-close-btn', title: 'swal-title-left' },
      didOpen: this.applyPopupStyle
    });

  } else {
    const payload = { search: { variety_code: rowData.variety_code } };

    this.service.postRequestCreator('get-all-variety-details', null, payload)
      .subscribe((res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200) {
          Swal.fire({
            title: 'View Variety Characteristics',
            html: `
              <div class="variety-details">

                <!-- Column 1 -->
                <div class="col">
                  <div class="field"><label>Crop Group/Crop Category</label><div class="value">${data?.group_name || '--'}</div></div>
                  <div class="field"><label>Botanical/Scientific Name</label><div class="value">${data?.botanic_name || '--'}</div></div>
                  <div class="field"><label>Variety Name</label><div class="value">${data?.variety_name || '--'}</div></div>
                  <div class="field"><label>Notified / Non-Notified</label><div class="value">${data?.is_notified == 1 ? 'Notified' : 'Non-Notified'}</div></div>
                  <div class="field"><label>Notification Number</label><div class="value">${data?.notification_number || '--'}</div></div>
                  <div class="field"><label>Year of Release</label><div class="value">${data?.year_of_release || '--'}</div></div>
                  <div class="field"><label>Category</label><div class="value">${data?.category_name ? `<span class="badge yellow">${data.category_name}</span>` : '--'}</div></div>
                </div>

                <!-- Column 2 -->
                <div class="col">
                  <div class="field"><label>Crop Name</label><div class="value">${data?.crop_name || '--'}</div></div>
                  <div class="field"><label>Crop Name (Hindi)</label><div class="value">${data?.crop_name_hindi || '--'}</div></div>
                  <div class="field"><label>Variety Code</label><div class="value">${data?.variety_code || '--'}</div></div>
                  <div class="field"><label>Notification Date</label><div class="value">${this.formatDate(data?.notification_date) || '--'}</div></div>
                  <div class="field"><label>Meeting Number</label><div class="value">${data?.meeting_number || '--'}</div></div>
                  <div class="field"><label>Select Type</label><div class="value">${data?.select_type ? `<span class="badge green">${data.select_type}</span>` : '--'}</div></div>
                  <div class="field"><label>Released By</label><div class="value">${data?.released_by ? `<span class="badge purple">${data.released_by}</span>` : '--'}</div></div>
                </div>

                <!-- Column 3 -->
                <div class="col">
                  <div class="field"><label>Developed By</label><div class="value">${data?.developed_by ? `<span class="badge red">${data.developed_by}</span>` : '--'}</div></div>
                  <div class="field"><label>Recommended State(s) for Cultivation</label><div class="value">${data?.states_for_cultivation || '--'}</div></div>
                  <div class="field"><label>Agro-Ecological Regions</label><div class="value">${data?.agro_ecological_regions || '--'}</div></div>
                  <div class="field"><label>Type of Maturity</label><div class="value">${data?.type_of_maturity || '--'}</div></div>
                  <div class="field"><label>Enter Maturity (in Days)</label><div class="value">${data?.maturity_days || '--'}</div></div>
                  <div class="field"><label>Average Yield (Qt/Ha)</label><div class="value">${data?.average_yeild_from && data?.average_yeild_to ? `${data.average_yeild_from} to ${data.average_yeild_to}` : '--'}</div></div>
                  <div class="field"><label>Climate Resilience</label><div class="value">${data?.climate_resilience || '--'}</div></div>
                </div>

                <!-- Column 4 -->
                <div class="col">
                  <div class="field"><label>IP Protected</label><div class="value">${data?.ip_protected == 1 ? '<span class="badge blue">Yes</span>' : '<span class="badge gray">No</span>'}</div></div>
                  <div class="field"><label>GI Tagged</label><div class="value"><span class="badge" style="background:#eee1a9;padding:4px 10px;border-radius:10px;">${data?.ig_tagged == 1 ? '<span class="badge yellow">Yes</span>' : '<span class="badge">No</span>'}</span></div></div>
                  <div class="field"><label>Reaction/Tolerance to Major Insect Pests</label><div class="value"><span class="badge gray">${data?.reaction_insect_pests || '--'}</div></div>
                  <div class="field"><label>Reaction/Resistance to Major Diseases</label><div class="value">${data?.reaction_major_diseases || '--'}</div></div>
                  <div class="field"><label>Crop Code</label><div class="value">${data?.crop_code || '--'}</div></div>
                </div>

              </div>
            `,
            confirmButtonText: 'Close',
            width: 850,
            customClass: { confirmButton: 'custom-close-btn',
              title: 'swal-title-left'
             },
            didOpen: this.applyPopupStyle
          });
        }
      });
  }
}

applyPopupStyle = () => {
  const style = document.createElement('style');
  style.textContent = `
                  .variety-details {
                  display: flex;
                  flex-wrap: wrap;
                  font-size: 14px;
                  text-align: left;
                }
                .variety-details .col {
                  width: 125px;
                  padding: 0 15px;
                  box-sizing: border-box;
                }
                .variety-details .field {
                  margin-bottom: 15px;
                }
                .variety-details .field label {
                  font-weight: 500;
                  font-size: 13px;
                  display: block;
                  margin-bottom: 4px;
                  color: #555;
                }
                .variety-details .field .value {
                  font-size: 14px;
                  font-weight: 600;
                  color: #000;
                }
                .badge {
                  padding: 4px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                  display: inline-block;
                }
                .badge.green { background:#c6f1c6; color:#006600; }
                .badge.red { background:#f4b4b4; color:#a10000; }
                .badge.purple { background:#e0b3f1; color:#4b0066; }
                .badge.yellow { background:#fff3b0; color:#8a6d00; }
                .badge.blue { background:#b3e6ff; color:#004080; }
                .badge.gray { background:#f0f0f0; color:#808080;; }
                .swal2-confirm.custom-close-btn {
                  background-color: #E97E15 !important;
                  color: white !important;
                  border: none !important;
                  padding: 8px 10px !important;
                  border-radius: 4px !important;
                  font-weight: 600;
                }
  `;
  document.head.appendChild(style);
}


  getVarietyDetailForExcel() {
      const payload = {
      search: {
        search_filter: String(this.ngFrom.get('variety_search_filter')?.value || '').trim(),
        year_from: this.ngFrom.get('year_from')?.value,
        year_to: this.ngFrom.get('year_to')?.value,
        group_code: this.group_code,
        crop_code: this.crop_code,
        crop_characterstic_require: false
      }
    };
    this.service.postRequestCreator('get-all-variety-details-for-excel', null, payload)
      .subscribe(
        (res: any) => {
          if (res?.EncryptedResponse?.status_code === 200 ) {
              this.varietyWiseDataListForExcel = res?.EncryptedResponse?.data;
          } else {
            this.varietyWiseDataListForExcel= [];
            console.log('Crop List Data not found.');
          }
        },
        (err) => {
          console.error('Error fetching Crop List data:', err);
        }
      );
  }

  sortData(pageType: any, column: string) {
    let data: any;
    if(pageType == 'group') data= this.cropGroupWiseDataList;
    else if (pageType == 'crop') data= this.cropWiseDataList;
    else data= this.varietyWiseDataList;

    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    data.sort((a, b) => {
      let valueA = a[column] ?? '';
      let valueB = b[column] ?? '';
      const isNumber = !isNaN(+valueA) && !isNaN(+valueB);
      if (isNumber) {
        valueA = +valueA;
        valueB = +valueB;
      } else {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  formatDate(input: string): string {
      if (!input) return 'NA';
      const date = new Date(input);
      if (isNaN(date.getTime())) return 'NA';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
  }

 applyFilters() {
    if (this.currentLevel === 'group') {
      this.getCropGroupWiseList();
    } else if (this.currentLevel === 'crop') {
      if (this.group_code) {
        this.getCropWiseList(this.group_code);
      }
    } else if (this.currentLevel === 'variety') {
      if (this.group_code && this.crop_code) {
        this.getVarietyWiseList(this.group_code, this.crop_code);
      }
    }
  }

showData(type: string) {
  if (type === 'group') {
    this.currentLevel = 'group';
    this.getCropGroupWiseList();
  } 
  else if (type === 'crop') {
    this.currentLevel = 'crop';

    if (this.group_code) {
      this.getCropWiseList(this.group_code);
    } else {
      if (this.cropGroupWiseDataList?.length > 0) {
        this.getCropWiseList(this.cropGroupWiseDataList[0].group_code);
      }
    }
  } 
  else if (type === 'variety') {
    this.currentLevel = 'variety';
    if (this.group_code && this.crop_code) {
      this.getVarietyWiseList(this.group_code, this.crop_code);
    } else {
      if (this.cropWiseDataList?.length > 0) {
        this.getVarietyWiseList(this.cropWiseDataList[0].group_code, this.cropWiseDataList[0].crop_code);
      }
    }
  }
}

// getCropWiseList(group_code: any) {
//   this.group_code = group_code;
//   this.currentLevel = 'crop';

//   const payload = {
//     search: {
//       search_filter: String(this.ngFrom.get('crop_search_filter')?.value || '').trim(),
//       year_from: this.ngFrom.value.year_from === 'ALL' ? '' : this.ngFrom.value.year_from,
//       year_to: this.ngFrom.value.year_to === 'ALL' ? '' : this.ngFrom.value.year_to,
//       group_code: this.group_code   
//     }
//   };

//   this.service.postRequestCreator('get-data-crop-code-wise-report-one', null, payload)
//     .subscribe(
//       (res: any) => {
//         if (res?.EncryptedResponse?.status_code === 200 ) {
//           this.cropWiseDataList = res?.EncryptedResponse?.data.data;
          
//           this.selected_group = res?.EncryptedResponse?.data?.data[0]?.group_name;
        
//           this.total_crop_count = res.cropWiseDataList.length;
//         } else {
//           this.cropWiseDataList = [];
//           console.log('Crop List Data not found.');
//         }
//       },
//       (err) => {
//         console.error('Error fetching Crop List data:', err);
//       }
//     );
// }

getCropWiseList(group_code: any) {
  this.group_code = group_code;
  this.currentLevel = 'crop';
  const searchKeyword = String(this.ngFrom.get('global_search')?.value || '').trim().toLowerCase();

  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('crop_search_filter')?.value || '').trim(),
      year_from: this.ngFrom.value.year_from === 'ALL' ? '' : this.ngFrom.value.year_from,
      year_to: this.ngFrom.value.year_to === 'ALL' ? '' : this.ngFrom.value.year_to,
      group_code: this.group_code   
    }
  };

  this.service.postRequestCreator('get-data-crop-code-wise-report-one', null, payload)
    .subscribe(
      (res: any) => {
        if (res?.EncryptedResponse?.status_code === 200 ) {
        
          const allData = res?.EncryptedResponse?.data?.data || [];

        
          this.cropWiseDataList = allData.filter((row: any) => {
            return (
              String(row.group_name || '').toLowerCase().includes(searchKeyword) ||
              String(row.crop_name || '').toLowerCase().includes(searchKeyword) || 
              String(row.total_variety_count || '').toLowerCase().includes(searchKeyword)
            );
          });

          this.selected_group = allData[0]?.group_name;
          this.total_crop_count = this.cropWiseDataList.length; 
        } else {
          this.cropWiseDataList = [];
          console.log('Crop List Data not found.');
        }
      },
      (err) => {
        console.error('Error fetching Crop List data:', err);
      }
    );
}

onTotalCropsClick() {
  this.currentLevel = 'crop';

  this.service.getCropDataByGroupCode('ALL').subscribe((res: any) => {
    if (res.status_code === 200) {
      this.cropWiseDataList = res.data;
      this.total_crop_count = res.total_crop_count;
    } else {
      this.cropWiseDataList = [];
      this.total_crop_count = 0;
    }
  }, (err) => {
    console.error('Error fetching crops:', err);
    this.cropWiseDataList = [];
    this.total_crop_count = 0;
  });
}


loadAllCrops() {
  this.showVarieties = false;
  this.selectedCrop = null;

  this.service.getCropDataByGroupCode('ALL').subscribe((res: any) => {
    if (res.status_code === 200) {
      this.crops = res.data;
      this.cropWiseDataList = res.data;
      this.total_crop_count = res.total_crop_count;
    } else {
      this.crops = [];
      this.cropWiseDataList = [];
      this.total_crop_count = 0;
    }
  }, (err) => {
    console.error('Error fetching crops:', err);
    this.crops = [];
    this.cropWiseDataList = [];
    this.total_crop_count = 0;
  });
}
onTotalVarietiesClick() {
  this.currentLevel = 'variety';
  this.group_code = this.group_code || '';  
  this.crop_code = this.crop_code || ''; 

  this.service.postRequestCreator('get-data-variety-wise-report-one', null, {
    search_filter: '',
    year_from: this.ngFrom.value.year_from || '',
    year_to: this.ngFrom.value.year_to || '',
    group_code: this.group_code,
    crop_code: this.crop_code
  }).subscribe((res: any) => {
    if(res?.EncryptedResponse?.status_code === 200) {
      this.varietyWiseDataList = res.EncryptedResponse.data || [];
      this.total_variety_count = this.varietyWiseDataList.length;
    } else {
      this.varietyWiseDataList = [];
      this.total_variety_count = 0;
    }
  }, (err) => {
    console.error('Error fetching varieties:', err);
    this.varietyWiseDataList = [];
    this.total_variety_count = 0;
  });
}

fetchTotalCrops() {
  this.service.getCropDataByGroupCode('ALL').subscribe((res: any) => {
    if (res.status_code === 200) {
      this.total_crop_count = res.total_crop_count;
    } else {
      this.total_crop_count = 0;
    }
  }, (err) => {
    console.error('Error fetching total crops:', err);
    this.total_crop_count = 0;
  });
}


myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

}
