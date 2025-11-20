import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FilterPaginateSearch } from 'src/app/common/data/data-among-components/filter-paginate-search';
import { PaginationUiComponent } from 'src/app/common/pagination-ui/pagination-ui.component';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import * as html2PDF from 'html2pdf.js';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @ViewChild(PaginationUiComponent) paginationUiComponent!: PaginationUiComponent;
  ngForm: FormGroup = new FormGroup([]);
  inventoryYearData: any;
  inventorySeasonData: any; 
  inventoryVarietyData: any;
  datatodisplay = [];
  isSearch: boolean;
  isCrop: boolean;
  showTab: boolean;
  private _productionCenter: any;
  filterPaginateSearch: FilterPaginateSearch = new FilterPaginateSearch();
  inventoryData = []
  allData: any; 
  selectedItems = []; 
  isDisabled: boolean = true; 
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
  Buyer = {
    value1: '  ',
    value2: ' Adarsh Seeds Ltd.',
    value3: ' C-2/45, M.G. Road, Sector-17A, Fariabad, Hariyana',
    value4: ' 9997776667' 
  };
  Seller= {
    value1: ' 14/04/2024      7:10:45 PM', 
    value2: ' ICAR IARI NEW DELHI',
    value3: ' Seed Production Unit, ICAR-IARI, Pusa Campus, New Delhi-110012',
    value4: ' 9988998899' 
  }; 
  Payment = {
    value1: ' UPI (Reference No.: 1111-2222-3333)',
    value2: ' Demand Draft (No.: DD123123)' 
  };
  Finalpayment={
    value1: '   ₹ 250.00',
    value2: '   ₹ 100.00',
    value3: '   ₹ 100.00',
    value4: '   ₹ 4450.00' 
  };
  Quantity={
    value1: '45.00',
    value2: '19.60',
    value3: '12.50',
    value4: '6.00',
    value5: '2.00'

  };
  Billno = {
    value1: '2024-25/R/001/1',
    value2: '2024-25/R/001/7',
    value3: '2024-25/R/001/10',
    value4: '2024-25/R/001/4', 
    value5: '2024-25/R/001/2'
  }; 
  varietyCategories: any[];
  addVarietySubmission: any[];
  varietyList: any;
  dummyData: { variety_id: string; variety_name: string; indent_quantity: number; bsp2Arr: any[]; }[]; 
  selectedTable: string;

  selectTable(table: string) {
    this.selectedTable = table;
  }
  constructor(private service: SeedServiceService, private fb: FormBuilder) {
    this.createForm(); 
  }  
  placeholderText: string = '';

  // updatePlaceholder() {
  //   this.placeholderText = this.chemicalName ? `Chemical Name: ${this.chemicalName}` : 'Enter chemical name';
  // }
  createForm() {
    this.ngForm = this.fb.group({ 
      BSPC: new FormControl(''),  
      variety: new FormControl(''),
      bsp2Arr: this.fb.array([
        this.bsp2arr(),
      ]), 
    }) 
  }

  ngOnInit(): void {
    this.fetchData();
     
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  fetchData() {
    this.getPageData();
    this.dummyData = [
      {
        'variety_id': '23112',
        'variety_name': 'PBW-154',
        'indent_quantity': 150,
        bsp2Arr: []
      },
      {
        'variety_id': '23114',
        'variety_name': 'HD-1925 (SHERA)',
        'indent_quantity': 150,
        bsp2Arr: []
      } 
    ] 
  } 
  getPageData(loadPageNumberData: number = 1, searchData: any | undefined = undefined) {
    this.service.postRequestCreator("data-characterstics-list", null, {
      page: loadPageNumberData, 
      pageSize: 50,
      search: {  }
    }).subscribe((apiResponse: any) => {
      console.log(apiResponse);
      if (apiResponse !== undefined
        && apiResponse.EncryptedResponse !== undefined
        && apiResponse.EncryptedResponse.status_code == 200) {
        this.filterPaginateSearch.itemListPageSize = 4;
        console.log(apiResponse); 
        this.allData = this.inventoryData

        if (this.allData === undefined) {
          this.allData = [];
        }
        this.filterPaginateSearch.Init(this.allData, this, "getPageData", undefined, 8, true); 
        this.initSearchAndPagination();
      }
    }); 
  } 
  initSearchAndPagination() {
    if (this.paginationUiComponent === undefined) {
      setTimeout(() => {
        this.initSearchAndPagination();
      }, 300);
      return;
    }
    this.paginationUiComponent.Init(this.filterPaginateSearch);
  }
  bsp2arr() {
    let temp = this.fb.group({
      filed_loc: ['', Validators.required],
      area_sown: ['', Validators.required],
      date_of_sowing: ['', Validators.required],
      quantity_of_sowning: [''],
      quantity_of_breedersown: [''],
      expected_date_inspection: [''],
      expected_date_harvest: [''],
      expected_producton: [''],
      inspected_area: [''],
      est_production: [''],
      harvest_date: [''],
      raw_seed_produced: [''],
      spp_name: [''], 
    });
    return temp;
  }

  getItems(form) {
    return form.controls.bsp2Arr.controls;
  }

  addMore(i) {
    this.itemsArray.push(this.bsp2arr());
  }

  remove(rowIndex: number) {
    this.itemsArray.removeAt(rowIndex);
  }

  get itemsArray() {
    return <FormArray>this.ngForm.get('bsp2Arr');
  }

  save(data) {
    console.log(data)

  }
  get items(): FormArray {
    return this.ngForm.get('bsp2Arr') as FormArray;
  }

  download() {
    const name = 'invoice';
    const element = document.getElementById('invoice-pdf');
    const options = {
      filename: `${name}.pdf`,
      image: {
        type: 'jpeg',
        quality: 1
      },
      html2canvas: {
        dpi: 192,
        scale: 4,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: 'landscape'
      }
    };
    html2PDF().set(options).from(element).toPdf().save();
  }

  printPage(): void {
    window.print();
  }
}
