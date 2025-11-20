import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.css']
})
export class ReportDashboardComponent implements OnInit {
selectedReport = 'state'; // default value

onReportSwitch(reportType: string) {
  this.selectedReport = reportType;
}

  constructor() { }

  ngOnInit(): void {
  }

}
