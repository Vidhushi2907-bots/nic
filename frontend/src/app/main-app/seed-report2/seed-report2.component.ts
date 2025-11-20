import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-seed-report2',
  templateUrl: './seed-report2.component.html',
  styleUrls: ['./seed-report2.component.css']
})
export class SeedReport2Component implements OnInit {

reportData: any = {};
 qrCodeDataUrl: any = '';

   stlReportStatusData: any[] = [];
    constructor(
    private _prodoctionService: ProductioncenterService,

  ) { }
    ngOnInit(): void {

    this.getPageData();
  }

  getPageData() {
  let route = "get-stl-report-status-data";
  let param = {};

  this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
    if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
      this.stlReportStatusData = res.EncryptedResponse.data ? res.EncryptedResponse.data : [];

      if (this.stlReportStatusData.length > 0) {
        let firstRecord = this.stlReportStatusData[0];

        this.reportData = {
          year: firstRecord.year,
          season: firstRecord.season,
          crop: firstRecord.crop_code,  
          refNumber: firstRecord.unique_code,
          date: firstRecord.date_of_test,  
          lab: firstRecord.seedLabtest?.lab_name || 'NA'
        };
      }
    } else {
      this.stlReportStatusData = [];
    }
  });
}

    saveData(formData: any, status: string) {
    let route = "update-stl-report-status-data";
    let param = {
      id: formData.id,
      data: formData,
      status: status
    };

    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        
        
        Swal.fire({
          title: 'Success!',
          text: 'Status updated successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        this.getPageData(); 
      }
    });
  }
    printContent() {
    let printContents = document.getElementById('printSection')!.innerHTML;
    let popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head><title>Print</title></head>
        <body onload="window.print(); window.close();">${printContents}</body>
      </html>
    `);
    popupWin!.document.close();
  }
// generatePdf() {
//   const printSection = document.getElementById('printSection');
//   if (!printSection) return;

//   printSection.classList.remove('hidden-pdf');

//   const options = {
//     margin: 10,
//     filename: 'STL_Report_Status.pdf',
//     image: { type: 'jpeg', quality: 0.95 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   };

//   import('html2pdf.js').then(html2pdf => {
//     html2pdf.default()
//       .set(options)
//       .from(printSection)
//       .save()
//       .then(() => {
//         printSection.classList.add('hidden-pdf');
//       });
//   });
// }

async generatePdf() {
  const printSection = document.getElementById('printSection');
  if (!printSection) return;
  printSection.classList.remove('hidden-pdf');


  const encryptedData = btoa(JSON.stringify(this.reportData));


  const reportUrl = `${window.location.origin}/report-data/${encryptedData}`;

  this.qrCodeDataUrl = await QRCode.toDataURL(reportUrl);

  setTimeout(() => {
    const options = {
      margin: 10,
      filename: `STL_Report_${this.reportData.refNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    import('html2pdf.js').then(html2pdf => {
      html2pdf.default()
        .set(options)
        .from(printSection)
           .save()          
    .then(() => {   
      printSection.classList.add('hidden-pdf');
    });
        
    });
  }, 500);
}

   reportData1 = {
    year: '2022-24',
    season: 'Rabi',
    crop: 'WHEAT',
    refNumber: 'STL/23-24/R/1',
    date: '14-08-2025',
    lab: 'STL Maharashtra State Seed Testing Laboratory, AKOLA',
    testedOn: '07/11/2024',
    samples: [
      {
        sno: 1,
        variety: 'KARAN VARUN (DBW 372)',
        lotNo: 'MARA22-0271-010-02',
        uniqueCode: 'xxxxxWwQeD',
        sampleNo: 3,
        ps: '95.91', ws: '1', im: '3', ocsp: 'NA', int: '10',
        wsNo: '3', ows1: '2', ows2: '1', odv: '2',
        ns: '90', as: '1', ds: '4', hs: '1', fs: 'NA',
        d1: '2', disease: 'NA', ng: 'N/A', moisture: 'HS: 2'
      },
      {
        sno: 2,
        variety: 'DBW 295 (Karan Abhimanyu)',
        lotNo: 'MARA22-0271-010-101',
        uniqueCode: 'xxxxxWwQeF',
        sampleNo: 4,
        ps: '95.90', ws: '2', im: '3', ocsp: '1', int: '10',
        wsNo: '2', ows1: '3', ows2: '2', odv: '2',
        ns: '90', as: '1', ds: '4', hs: '1', fs: 'NA',
        d1: '2', disease: 'NA', ng: 'N/A', moisture: 'HS: 2'
      },
      {
        sno: 3,
        variety: 'KARAN VARUN (DBW 372)',
        lotNo: 'NA/dbwvarun/24',
        uniqueCode: 'OcxpX87',
        sampleNo: 6,
        ps: 'NA', ws: 'NA', im: 'NA', ocsp: 'NA', int: 'NA',
        wsNo: 'NA', ows1: 'NA', ows2: 'NA', odv: 'NA',
        ns: '90', as: '1', ds: '4', hs: '1', fs: 'NA',
        d1: '2', disease: 'NA', ng: 'N/A', moisture: 'HS: 2'
      }
    ]
  };
}


