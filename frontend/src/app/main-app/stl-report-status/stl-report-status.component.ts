import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
// import { getLoggedInUserId } from 'src/app/utils/user-util';
import html2pdf from 'html2pdf.js';
// import autoTable from 'jspdf-autotable';
import autoTable, { RowInput } from 'jspdf-autotable';
import * as html2PDF from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import * as QRCode from 'qrcode';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-stl-report-status',
  templateUrl: './stl-report-status.component.html',
  styleUrls: ['./stl-report-status.component.css']
})
export class StlReportStatusComponent implements OnInit {
  ngForm!: FormGroup
  // stlReportStatusData: any;
  // stlReportStatusData: any = {};
  yearDataList: any;
  todayDate: Date = new Date();
referenceNumber: string = '';
  varietyDataList: any;
  reportData: any[] = []; 
  encryptedData: string = "";
  stlReportStatusData: any[] = [];

  cropDataList: any;
  seasonDataList: any;
  formDivVisibile: boolean = false;
  constructor(private _prodoctionService: ProductioncenterService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.createForm()
  }
  createForm() {
    this.ngForm = this.fb.group({
      year: ['', [Validators.required]],
      season: ['', [Validators.required]],
      crop: ['', [Validators.required]],
      variety: ['', [Validators.required]],
    });
    this.ngForm.controls['season'].disable();
    this.ngForm.controls['crop'].disable();
    this.ngForm.controls['variety'].disable();
    this.ngForm.controls['year'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['season'].enable();
        this.ngForm.controls['crop'].disable();
        this.ngForm.controls['variety'].disable();
        this.getSeasonData()
      }
    });
    this.ngForm.controls['season'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['crop'].enable();
        this.ngForm.controls['variety'].disable();
        this.getCropData()
      }
    });
    this.ngForm.controls['crop'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
        this.ngForm.controls['variety'].enable();
        this.getVarietyData()
      }
    });
    this.ngForm.controls['variety'].valueChanges.subscribe(newvalue => {
      if (newvalue) {
      }
    });
  }

  ngOnInit(): void {
    this.getYearData();
    this.referenceNumber = 'REF-' + Math.floor(Math.random() * 100000);
    
  }
  getYearData() {
    let route = "get-generate-sample-forwarding-slip-year-data";
    let param = {

    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.yearDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }
  getSeasonData() {
    let route = "get-generate-sample-forwarding-slip-season-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
      }
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.seasonDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }
  getCropData() {
    let route = "get-generate-sample-forwarding-slip-crop-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value
      }
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.cropDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }

  getVarietyData() {
    let route = "get-generate-sample-forwarding-slip-variety-data";
    let param = {

        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        "testing_type" :'table1',
    }
    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.varietyDataList = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }

    })
  }

  getPageData() {
     const token = localStorage.getItem('token');
     const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser') || '{}');
const userId = currentUser?.id || null; 

    let route = "get-stl-report-status-data";
    let param = {
      "search": {
        "year": this.ngForm.controls["year"].value,
        "season": this.ngForm.controls["season"].value,
        "crop_code": this.ngForm.controls["crop"].value,
        "variety_code": this.ngForm.controls["variety"].value,
         user_id: userId 
      }
    }
    this._prodoctionService.postRequestCreator(route, param,  { Authorization: `Bearer ${token}` }).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        this.stlReportStatusData = res.EncryptedResponse.data ? res.EncryptedResponse.data : []
      }else {
        this.stlReportStatusData = res.EncryptedResponse.data || [];

      }
       

    })
  }
  confirmProceedForPacking(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed for packing?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#E97E15',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveData1(data, 'success');
      }
    });
  }

  saveData1(formData: any, status: string) {
    console.log('foamData', formData);
    let route = "update-stl-report-status-data";
    let param = {
      id: formData.id,
      status: status,
    };

    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: `<p style="font-size:25px;">Status updated to ${status}</p>`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        // Update button state and appearance
        formData.isProceeded = true;
        formData.status = 'success';  // Ensure the status is set to 'success'
        this.updateButtonState1(formData);

        // Trigger change detection manually to ensure the button updates
        this.cdr.detectChanges();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Status not updated</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  updateButtonState1(data: any) {
    data.isProceeded = true;
  }
   isDiscardVisible(data: any): boolean {
    return data.status !== 'success' && data.status !== 're-sample' && (data.status === 'discard' || data.status === null);
  }

  confirmDiscard(data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to discard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, discard it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#E97E15',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveData(data, 'discard');
      }
    });
  }

  saveData(formData: any, status: string) {
    console.log('foamData', formData);
    let route = "update-stl-report-status-data";
    let param = {
      id: formData.id,
      data:formData,
      status: status,
    };

    this._prodoctionService.postRequestCreator(route, param, null).subscribe(res => {
      if (res.EncryptedResponse && res.EncryptedResponse.status_code === 200) {
        Swal.fire({
          title: `<p style="font-size:25px;">Status updated to ${status}</p>`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });

        formData.isDiscarded = true;
        formData.status = 'discard'; 
        this.updateButtonState(formData);
        this.getPageData();
        this.cdr.detectChanges();
      } else {
        Swal.fire({
          title: '<p style="font-size:25px;">Status not updated</p>',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E97E15'
        });
      }
    });
  }

  updateButtonState(data: any) {
    data.isDiscarded = true;
  }
  


  searchData() {
    this.formDivVisibile = true;
    this.getPageData();
  }
  printContent() {
    let printContents = document.getElementById('printSection').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }



  async generatePdf() {
  try {
    const pdf = new jsPDF('l', 'mm', 'a3'); // Landscape A3
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    //  Logo
    const logoUrl = 'assets/images/logo.png';
    try {
      pdf.addImage(logoUrl, 'PNG', 15, 8, 30, 30);
    } catch {
      console.warn('Logo not found, skipping.');
    }

    // 2 Selected variety
    const selectedVariety = this.varietyDataList.find(
      (v: any) => v.code === this.ngForm.controls["variety"].value
    );

    // 3 Token & userId
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser') || '{}');
const userId = currentUser?.id || null;
console.log(" [Frontend] CurrentUser:", currentUser);
console.log(" [Frontend] Extracted userId:", userId);
    // const userId = getLoggedInUserId(); // may return null if not logged-in

    // 4 Payload for QR code
    const payload: any = {
      year: this.ngForm.controls["year"].value,
      season: this.ngForm.controls["season"].value,
      crop: this.ngForm.controls["crop"].value,
      variety: this.ngForm.controls["variety"].value,
      variety_id: selectedVariety ? selectedVariety.id : null,
      referenceNumber: this.referenceNumber,
      date: formattedDate,
       user_id: userId
    };
    console.log("[Frontend] Final Payload sending to QR/PDF:", payload);

    // Optional: include user_id only if available
    // if (userId) payload.user_id = userId;
    if (token) payload.token = token;

    console.log("Final Payload:", payload);

    const encryptedForm = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      'a-343%^5ds67fg%__%add'
    ).toString();

    const encryptedUrl = `${window.location.origin}/bsp-proforma-one-report-qr1?data=${encodeURIComponent(encryptedForm)}`;

  
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(encryptedUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png'
      });
      if (qrCodeDataUrl.startsWith('data:image/png')) {
        pdf.addImage(qrCodeDataUrl, 'PNG', pdfWidth - 55, 0, 40, 40);
      }
    } catch {
      console.warn('QR code generation failed, skipping.');
    }

    // 6 Header Section
    const headerY = 15;

    // Logo Box
    const logoX = 15, logoY = 8, logoWidth = 30, logoHeight = 30;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);
    pdf.rect(logoX, logoY, logoWidth, logoHeight);
    try { pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight); } catch {}

    // Center Text
    pdf.setFont('helvetica', 'bold', );
    pdf.setFontSize(16);
    pdf.setTextColor(0, 153, 51);
    pdf.text('BSPC TEST FOUR', pdfWidth / 2, 15, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setTextColor(0, 153, 51);
    pdf.text('AGRA, UTTAR PRADESH', pdfWidth / 2, 23, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(0, 153, 51);
    pdf.setFont('helvetica', 'normal');
    pdf.text('"Seed Testing Lab Report"', pdfWidth / 2, 30, { align: 'center' });

    // 7 Horizontal Green Line
    const subHeaderStartY = headerY + 25;
    pdf.setDrawColor(157, 242, 138);
    pdf.setLineWidth(0.5);
    pdf.line(10, subHeaderStartY, pdfWidth - 10, subHeaderStartY);

    // 8 Subheader: Left-Center-Right
    const rightX = pdfWidth - 60;
    pdf.setFontSize(10);

    // Left
// Row 1: Year of Indent + Value
pdf.setTextColor(0, 0, 0);            
pdf.setFont('helvetica', 'normal');
pdf.text(`Year of Indent:`, 15, subHeaderStartY + 6);

pdf.setFont('helvetica', 'bold');
pdf.text(`${payload.year}`, 39, subHeaderStartY + 6); 

// Row 2: Season + Value
// pdf.setTextColor(0, 0, 0);             
// pdf.setFont('helvetica', 'normal');
// pdf.text(`Season:`, 15, subHeaderStartY + 12);

// pdf.setFont('helvetica', 'bold');
// pdf.text(`${payload.season}`, 30, subHeaderStartY + 12); 

// Season Mapping
let seasonText = payload.season;
if (payload.season === 'K') {
  seasonText = 'Kharif';
} else if (payload.season === 'R') {
  seasonText = 'Rabi';
}

// Row 2: Season + Value
pdf.setTextColor(0, 0, 0); // Black
pdf.setFont('helvetica', 'normal');
pdf.text(`Season:`, 15, subHeaderStartY + 12);

pdf.setFont('helvetica', 'bold');
pdf.text(`${seasonText}`, 30, subHeaderStartY + 12);



    // Center
pdf.setTextColor(0, 0, 0);
pdf.setFont('helvetica', 'normal');
pdf.text(`Crop:`, pdfWidth / 2 - 15, subHeaderStartY + 6, { align: 'center' });

pdf.setFont('helvetica', 'bold');
pdf.text(`${payload.crop}`, pdfWidth / 2 + 5, subHeaderStartY + 6, { align: 'center' });


    // Right

pdf.setTextColor(0, 0, 0);
pdf.setFont('helvetica', 'normal');
pdf.text(`Date:`, rightX, subHeaderStartY + 6);
pdf.setFont('helvetica', 'bold');
pdf.text(`${payload.date}`, rightX + 15, subHeaderStartY + 6);

pdf.setFont('helvetica', 'normal');
pdf.text(`Reference No:`, rightX, subHeaderStartY + 12);
pdf.setFont('helvetica', 'bold');
pdf.text(`${payload.referenceNumber}`, rightX + 25, subHeaderStartY + 12);

    // 9 Table Headers
    const tableHead: RowInput[] = [
      [
        { content: 'SNo.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [157, 242, 138], textColor: [0,0,0] } },
        { content: 'Sample Details', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Testing Details', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Physical Purity (% by Weight)', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Determination By (No./Kg)', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Germination (%)', colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Seed Health', colSpan: 3, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
        { content: 'Others', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', fillColor: [157,242,138], textColor:[0,0,0] } },
      ],
      [
        'Variety','Lot No.','Lab Name','Date of Test','PS','WS(P)','OCS(P)','IM','WS','OWS','OCS','ODV','NS','AS','DS','HS','FS','ID','Disease','NG','Moisture','HS'
      ]
    ];

    // 10 Table Body
    const tableBody = this.stlReportStatusData.map((data, i) => [
      i + 1,
      data?.m_crop_variety?.variety_name || 'NA',
      data?.lot_no || 'NA',
      data?.seedLabtest?.lab_name || 'NA',
      data?.date_of_test || 'NA',
      data?.pure_seed || 'NA',
      data?.weed_seed_purity || 'NA',
      data?.other_crop_purity || 'NA',
      data?.inert_matter || 'NA',
      data?.weed_seed || 'NA',
      data?.other_seed || 'NA',
      data?.other_crop_seed || 'NA',
      data?.other_distinguisable_varieties || 'NA',
      data?.normal_seeding || 'NA',
      data?.abnormal_seeding || 'NA',
      data?.dead_seed || 'NA',
      data?.hard_seed || 'NA',
      data?.fs || 'NA',
      data?.insect_damage || 'NA',
      'NA', 'NA',
      data?.m || 'NA',
      data?.husk || 'NA'
    ]);

    // 11 Render Table
    autoTable(pdf, {
      head: tableHead,
      body: tableBody,
      startY: subHeaderStartY + 28,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
        lineWidth: 0.1,
        lineColor: [0,0,0]
      },
      headStyles: { fillColor:[157,242,138], textColor:[0,0,0], fontStyle:'bold' },
      alternateRowStyles: { fillColor:[240,240,240] },
      theme: 'grid',
      pageBreak: 'auto'
    });

    // 12 Signature
    const finalY = (pdf as any).lastAutoTable.finalY || subHeaderStartY + 60;
    const sigX = pdf.internal.pageSize.getWidth() - 70;
    pdf.setFontSize(10);
    pdf.setFont('helvetica','bold');
    pdf.text('--SD--', sigX, finalY + 10);
    pdf.setFont('helvetica','normal');
    pdf.text('(Dr. Parimal Tripathi)', sigX, finalY + 15);
    pdf.text('Deputy Director', sigX, finalY + 20);

    // 13 Footer Box
    const boxX = 15, boxY = finalY + 28;
    const boxWidth = pdf.internal.pageSize.getWidth() - 30, boxHeight = 16;
    pdf.setFillColor(233,209,166);
    pdf.rect(boxX, boxY, boxWidth, boxHeight, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(0,0,0);
    pdf.setFont('helvetica','normal');
    pdf.text(
      "PS: Pure Seed, IM: Inert Matter, WS: Weed Seed, M: Moisture, OWS: Objectionable Weed Seed, OCSP: Other Crop Seed Purity, AS: Abnormal Seedling, DS: Dead Seed, HS: Hard Seed, FS: Fresh",
      boxX + 5, boxY + 6
    );
    pdf.text(
      "OCSP: Other Crop Seed Purity, AS: Abnormal Seedling, DS: Dead Seed, HS: Hard Seed, FS: Fresh",
      boxX + 5, boxY + 12
    );

    // 14 Last Note (जैसा sample में है)
const noteY = boxY + boxHeight + 10;
pdf.setFontSize(9);
pdf.setTextColor(0, 0, 0);
pdf.setFont('helvetica','italic');
pdf.text(
  "*Note This is an electronically generated report and does not require signature.",
  pdf.internal.pageSize.getWidth() / 2,
  noteY,
  { align: 'center' }
);

    // 14 Download PDF
    pdf.save('BSPC_Test_Report.pdf');

  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}


}
