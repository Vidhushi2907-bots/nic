import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

@Component({
  selector: 'app-crop-wise-statistics',
  templateUrl: './crop-wise-statistics.component.html',
  styleUrls: ['./crop-wise-statistics.component.css']
})
export class CropWiseStatisticsComponent implements OnInit {
  @Output() reportSwitched = new EventEmitter<string>();
  currentLevel: 'group' | 'state' | 'crop' | 'variety' | 'final' = 'group';
  selectedReport = 'crop';
  ngFrom: FormGroup;
  showExportOptions = false;
  stateWiseDataList: any[] = [];
  cropGroupWiseDataList: any[] = [];
  cropWiseDataList: any[] = [];
  varietyWiseDataList: any[] = [];
  notificationYears: number[] = [];
  state_code= null;
  group_code= null;
  crop_code= null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  varietyWiseDataListForExcel: any[] = [];
  groupColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "Total State Count", dbColumnName: "total_state_count", width: 25 },
    { name: "Total Crop Count", dbColumnName: "total_crop_count", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  stateColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "State Name", dbColumnName: "state_name", width: 25 },
    { name: "Crop Name", dbColumnName: "total_crop_count", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  cropColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "State Name", dbColumnName: "state_name", width: 25 },
    { name: "Crop Name", dbColumnName: "crop_name", width: 20 },
    { name: "Total Variety Count", dbColumnName: "total_variety_count", width: 20 },
  ];
  varietyColumns = [
    { name: "SN", isIndex: true, width: 10 },
    { name: "Group Name", dbColumnName: "group_name", width: 25 },
    { name: "State Name", dbColumnName: "state_name", width: 25 },
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
    // { name: "Year of Release", dbColumnName: "variety_name", width: 25 },
    { name: "Recommended State(s) for Cultivation", dbColumnName: "states_for_cultivation", width: 25 },
    // { name: "IET Number/Name By Which Tested", dbColumnName: "variety_name", width: 25 },
    // { name: "Responsible Institution for Developing Breeder Seed", dbColumnName: "variety_name", width: 25 },
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

 constructor(private fb: FormBuilder,private service: SeedServiceService) {
    this.createForm();
 }

 ngOnInit() {
    this.getCropGroupWiseList();
    this.getNotificationYears();
 }

 createForm() {
    this.ngFrom = this.fb.group({
      year_from: [''],
      year_to: [''],
      state_search_filter: [''],
      group_code_search_filter: [''],
      crop_search_filter: [''],
      variety_search_filter: [''],
      reportType: ['crop']
    });
    this.ngFrom.controls["state_search_filter"].valueChanges.subscribe(newvalue => {
      this.getStateWiseList(this.group_code);
    });
    this.ngFrom.controls["group_code_search_filter"].valueChanges.subscribe(newvalue => {
      this.getCropGroupWiseList();
    });
    this.ngFrom.controls["crop_search_filter"].valueChanges.subscribe(newvalue => {
      this.getCropWiseList(this.group_code,this.state_code);
    });
    this.ngFrom.controls["variety_search_filter"].valueChanges.subscribe(newvalue => {
      this.getVarietyWiseList(this.group_code,this.state_code,this.crop_code);
    });
 }

 searchFilter() {
    this.getVarietyWiseList(this.group_code,this.state_code,this.crop_code);
 }

 resetFilters() {
   this.currentLevel= 'variety';
   this.ngFrom.reset({
    year_from: '',
    year_to: '',
    reportType: this.selectedReport 
   });
    this.ngFrom.get('state_search_filter')?.setValue('', { emitEvent: false });
    this.ngFrom.get('group_code_search_filter')?.setValue('', { emitEvent: false });
    this.ngFrom.get('crop_search_filter')?.setValue('', { emitEvent: false });
    this.ngFrom.get('variety_search_filter')?.setValue('', { emitEvent: false });
    this.getVarietyWiseList(this.group_code,this.state_code,this.crop_code);
 }

 switchReport() {
  const selectedReport = this.ngFrom.get('reportType')?.value;
  this.reportSwitched.emit(selectedReport); 
 }

 getNotificationYears() {
    this.service.postRequestCreator('get-year-from-variety', null, null)
    .subscribe(
      (res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 ) {
          this.notificationYears = data;
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

 getCropGroupWiseList() {
  this.currentLevel = 'group';
  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('group_code_search_filter')?.value || '').trim(),
    }
  };

  this.service.postRequestCreator('get-crop-data-crop-group-wise-report-two', null, payload)
    .subscribe(
      (res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 ) {
          this.cropGroupWiseDataList = data;
        } else {
          this.cropGroupWiseDataList=[];
          console.log('Crop List Data not found.');
        }
      },
      (err) => {
        console.error('Error fetching Crop List data:', err);
      }
    );
 }

 getStateWiseList(group_code:any) {
  this.currentLevel = 'state';
  this.group_code= group_code;
  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('state_search_filter')?.value || '').trim(),
      group_code: group_code
    }
  };

  this.service.postRequestCreator('get-crop-data-state-wise-report-two', null, payload)
    .subscribe(
      (res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 ) {
          this.stateWiseDataList = data;
        } else {
          this.stateWiseDataList=[];
          console.log('Crop List Data not found.');
        }
      },
      (err) => {
        console.error('Error fetching Crop List data:', err);
      }
    );
 }
 
 getCropWiseList(group_code: any,state_code: any) {
  this.group_code= group_code;
  this.state_code= state_code;
  this.currentLevel = 'crop';
  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('crop_search_filter')?.value || '').trim(),
      state_code: state_code,
      group_code: group_code
    }
  };


  this.service.postRequestCreator('get-data-crop-wise-report-two', null, payload)
    .subscribe(
      (res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 ) {
          this.cropWiseDataList = data;
        } else {
          this.cropWiseDataList=[];
          console.log('Crop List Data not found.');
        }
      },
      (err) => {
        console.error('Error fetching Crop List data:', err);
      }
    );
 }

 getVarietyWiseList(group_code: any, state_code: any, crop_code: any) {
  this.currentLevel = 'variety';
  this.group_code= group_code;
  this.state_code= state_code;
  this.crop_code= crop_code;

  const payload = {
    search: {
      search_filter: String(this.ngFrom.get('variety_search_filter')?.value || '').trim(),
      year_from: this.ngFrom.get('year_from')?.value,
      year_to: this.ngFrom.get('year_to')?.value,
      state_code: state_code, 
      group_code: group_code, 
      crop_code: crop_code, 
    }
  };

  this.service.postRequestCreator('get-data-variety-wise-report-two', null, payload)
    .subscribe(
      (res: any) => {
        const data = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 ) {
          this.varietyWiseDataList = data;
        } else {
          this.varietyWiseDataList=[];
          console.log('Crop List Data not found.');
        }
      },
      (err) => {
        console.error('Error fetching Crop List data:', err);
      }
    );
 }

 goBack() {
  this.getCropGroupWiseList();
  this.currentLevel= 'group';
  this.state_code= null;
  this.group_code= null;
  this.crop_code= null;
  // if (this.currentLevel === 'variety') this.currentLevel = 'crop';
  // else if (this.currentLevel === 'crop') this.currentLevel = 'group';
  // else if (this.currentLevel === 'group') this.currentLevel = 'main';
 }


  async downloadExcel(pageType: any,isShowFilter: any) {
    let fileName: string;
    let title: string;
    let excelColumns: any;
    let data: any;
    this.showExportOptions = false;
    if (pageType === 'state') {
      fileName = 'State_wise_statistics';
      title = 'State Wise Statistics';
      excelColumns = this.stateColumns;
      data = this.stateWiseDataList;
    } else if (pageType === 'group') {
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

    //  Title Row: Merge top 4 columns
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

    //  Filter Labels Row
    const fromYear = this.ngFrom.get('year_from')?.value || 'NA';
    const toYear = this.ngFrom.get('year_to')?.value || 'NA';
    let searchKeyword = 'NA';

    if (pageType === 'state') {
      searchKeyword = this.ngFrom.get('state_search_filter')?.value || 'NA';
    } else if (pageType === 'group') {
      searchKeyword = this.ngFrom.get('group_code_search_filter')?.value || 'NA';
    } else if (pageType === 'crop') {
      searchKeyword = this.ngFrom.get('crop_search_filter')?.value || 'NA';
    } else {
      searchKeyword = this.ngFrom.get('variety_search_filter')?.value || 'NA';
    }

    // Add filter rows
      if (isShowFilter) {
        worksheet.addRow(['', 'From Notification Year', 'To Notification Year', 'Search Keyword']);
        worksheet.addRow(['', fromYear, toYear, searchKeyword]);
        worksheet.addRow([]);
      } else {
        worksheet.addRow(['','Search Keyword']);
        worksheet.addRow(['', searchKeyword]);
        worksheet.addRow([]);
      }
    //  Table Headers Row
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

    //  Set Column Widths
    excelColumns.forEach((x, i) => {
      if (x.width) {
        worksheet.getColumn(i + 1).width = x.width;
      }
    });

    //  Add Data Rows
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
    //  Save as Excel File
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
    } else if (pageType === 'state') {
      fileName = 'State_wise_statistics.pdf';
      title = 'State Wise Statistics';
      pdfColumns = this.stateColumns;
      data = this.stateWiseDataList;
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
    } else if (pageType === 'state') {
      searchKeyword = this.ngFrom.get('state_search_filter')?.value || ' NA';
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

  viewVarietyDetail(variety_code: any) {
    const payload = {
      search: {
        variety_code: variety_code
      }
    };

    this.service.postRequestCreator('get-all-variety-details', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 ) {
            Swal.fire({
              title: 'View Variety Characteristics State',
              html: `
                    <div style="display: flex; flex-wrap: wrap; font-size: 14px; text-align: left;">
                      <div style="width: 50%; padding: 4px 10px;">
                        <b>Crop Group/Crop Category:</b> ${data?.group_name || 'NA'}<br>
                        <b>Botanical/Scientific Name:</b> ${data?.botanic_name || 'NA'}<br>
                        <b>Variety Name:</b> ${data?.variety_name || 'NA'}<br>
                        <b>Notified / Non-Notified:</b> ${data?.is_notified == 1 ? 'Yes': 'No'}<br>
                        <b>Category: ${data?.category_name || 'NA'}</b><br>
                        <b>Select Type:</b> <span class="badge" style="background:#6ca06b;color:#fff;padding:4px 10px;border-radius:10px;">${data?.select_type || 'NA'}</span><br>
                        <b>IP Protected:</b> <span class="badge" style="background:#add8e6;padding:4px 10px;border-radius:10px;"> ${data?.ip_protected ? 'Yes' : 'No'} </span><br>
                        <b>Released By:</b> <span class="badge" style="background:#e0b3f1;padding:4px 10px;border-radius:10px;">${data?.released_by || 'NA'}</span><br>
                        <b>Recommended State(s) for Cultivation:</b> ${data && data.states_for_cultivation && data.states_for_cultivation.map((s: { state_name: any; }) => s.state_name).join(', ')}<br>
                        <b>Type of Maturity:</b> ${data?.maturity_name || 'NA'}<br>
                        <b>Average Yield (Qt/Ha):</b> ${data?.average_yeild_from || 0} - ${data?.average_yeild_to || 0}<br>
                        <b>Reaction/Tolerance to Major Insect Pests:</b> ${data && data.reaction_insect_pests && data.reaction_insect_pests.map((s: { name: any; }) => s.name).join(', ')}
                      </div>
                      <div style="width: 50%; padding: 4px 10px;">
                        <b>Crop Name:</b> ${data?.crop_name || 'NA'}<br>
                        <b>Crop Name (Hindi):</b> ${data?.crop_name_hindi || 'NA'}<br>
                        <b>Variety Code:</b> ${data?.variety_code || 'NA'}<br>
                        <b>Year of Introduction in the market:</b>${this.formatDate(data?.year_of_introduction)}<br>
                        <b>Developed By:</b> <span class="badge" style="background:#e07c7c;color:white;padding:4px 10px;border-radius:10px;">${data?.developed_by || 'NA'}</span><br>
                        <b>GI Tagged:</b> <span class="badge" style="background:#eee1a9;padding:4px 10px;border-radius:10px;">${data?.ig_tagged ? 'Yes': 'No'}</span><br>
                        <b>Agro-Ecological Regions:</b>${data?.agro_ecological_regions || 'NA'}<br>
                        <b>Enter Maturity (in Days):</b> ${data?.enter_maturity || 'NA'}<br>
                        <b>Climate Resilience:</b>${data && data.climate_resilience && data.climate_resilience.map((s: { name: any; }) => s.name).join(', ')}<br>
                        <b>Reaction/Resistance to Major Diseases:</b>${data && data.reaction_major_diseases && data.reaction_major_diseases.map((s: { name: any; }) => s.name).join(', ')}
                      </div>
                    </div>
                  `,
              confirmButtonText: 'Close',
              width: 1000,
              customClass: {
                confirmButton: 'custom-close-btn'
              },
              didOpen: () => {
                const style = document.createElement('style');
                style.textContent = `
                  .swal2-confirm.custom-close-btn {
                    background-color: #E97E15 !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 20px !important;
                    border-radius: 4px !important;
                    font-weight: 600;
                  }
                  .swal2-confirm.custom-close-btn:hover {
                    background-color: #E97E15 !important;
                  }
                `;
                document.head.appendChild(style);
              }
            });
          } else {
            console.log('Crop List Data not found.');
          }
        },
        (err) => {
          console.error('Error fetching Crop List data:', err);
        }
      );
  }

    getVarietyDetailForExcel() {
      const payload = {
      search: {
        search_filter: String(this.ngFrom.get('variety_search_filter')?.value || '').trim(),
        year_from: this.ngFrom.get('year_from')?.value,
        year_to: this.ngFrom.get('year_to')?.value,
        group_code: this.group_code,
        crop_code: this.crop_code,
        state_code: this.state_code,
        crop_characterstic_require: true
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
    else if(pageType == 'state') data= this.stateWiseDataList;
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
}