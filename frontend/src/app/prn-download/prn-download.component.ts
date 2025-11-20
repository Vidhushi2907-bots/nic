// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-prn-download',
//   templateUrl: './prn-download.component.html',
//   styleUrls: ['./prn-download.component.css']
// })
// export class PrnDownloadComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }



import { Component } from "@angular/core";
// import { PrnService } from "../prn.service";

@Component({
  selector: "app-prn-download",
  templateUrl: "./prn-download.component.html",
  styleUrls: ["./prn-download.component.css"],
})
export class PrnDownloadComponent {
  constructor() {}
  // private prnService: PrnService
  downloadPRN() {
    const productName = "Battery Model X";
    const serialNumber = "SN" + Math.floor(100000 + Math.random() * 900000);

    // this.prnService.generatePRN(productName, serialNumber).subscribe((blob) => {
    //   const a = document.createElement("a");
    //   const url = window.URL.createObjectURL(blob);
    //   a.href = url;
    //   a.download = "label.prn";
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);
    // });
  }
}
