import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// //pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ProductioncenterService } from 'src/app/services/productionCenter/productioncenter.service';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-generate-invoice-qr',
  templateUrl: './generate-invoice-qr.component.html',
  styleUrls: ['./generate-invoice-qr.component.css']
})
export class GenerateInvoiceQrComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  baseUrl: string = environment.baseUrl;
  AESKey:string = environment.AESKey;
  showTab: boolean;
  private _productionCenter: any;
  yearOfIndent = [
    {
      'year': '2024-2025',
      'value': '2024'
    },
    {
      'year': '2023-2024',
      'value': '2023'
    },
    {
      'year': '2022-2023',
      'value': '2022'
    },
    {
      'year': '2021-2022',
      'value': '2021'
    }
  ]
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;

  decryptedId: any;
  decryptedUserId: any;
  decryptedUserspaCode : any;

  indenterinvoiceData:any;
  spainvoiceData: any;

  spaDetails: any[] = [];
  grandTotal:any;
  encryptedData: string;
  gst: any;


  constructor(private service: SeedServiceService, private router: Router,private productionCenterService: ProductioncenterService, private fb: FormBuilder, private route: ActivatedRoute) {
  }  

  ngOnInit(): void {
     // Retrieve encryptedId from route params
     this.route.params.subscribe(params => {
      const encryptedId = params['submissionid'];

      console.log("From URL QR", encryptedId)
      
      if (encryptedId) {
        // Decrypt the encryptedId
        const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), this.AESKey);
        this.decryptedId = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8)).id;
        const encryptedForm = CryptoJS.AES.encrypt(JSON.stringify({ encryptedId }), this.AESKey).toString();
        this.encryptedData = encryptedId;
        }
    });
    this.getInvoceData(this.decryptedId);
  }
  // id: this.decryptedId,
  getInvoceData(idd: any) {
    const id = this.decryptedId;
    const encryptedId = this.encryptData({ id });
    const param = { id: encryptedId };
    
    this.productionCenterService.postRequestCreator("spa-generate-invoice", param).subscribe((data: any) => {
      try {
        const decryptedData = this.decryptData(data.EncryptedResponse.data);
        this.indenterinvoiceData = decryptedData.data[0].indenter_details[0];
        this.spainvoiceData = decryptedData.data[0].indenter_details[0].spa_details[0];
        
        if (this.indenterinvoiceData && this.indenterinvoiceData.spa_details && this.indenterinvoiceData.spa_details.length > 0) {
          this.indenterinvoiceData.spa_details.forEach((spaDetail: any) => {
            this.spaDetails.push(spaDetail);
          });
          this.grandTotal = 0;
          this.gst = 0;
          this.spaDetails.forEach((spa: any) => {
            this.gst = spa.grand_total * spa.seed_amount_gst / 100;
            console.log("spa.grand_total", spa.grand_total);
            console.log("spa.seed_amount_gst", spa.seed_amount_gst);
          });
        }
      } catch (error) {
        console.error("Decryption error:", error); // Log decryption errors
      }
    });
  }
  
   encryptData(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), environment.AESKey).toString();
  }
  
   decryptData(data: any) {
    const bytes = CryptoJS.AES.decrypt(data, environment.AESKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }    
}

