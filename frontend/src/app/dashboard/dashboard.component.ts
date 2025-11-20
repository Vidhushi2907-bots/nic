
// @Component({
  //   selector: 'app-dashboard',
  //   templateUrl: './dashboard.component.html',
  //   styleUrls: ['./dashboard.component.css']
  // })
  // export class DashboardComponent implements OnInit {
    
  //   constructor() { }
  //   ngOnInit(): void {
    //   }
    
    // }
    
    import { Component } from '@angular/core';
    import { ChartConfiguration } from 'chart.js';
    import { CommonModule, NgStyle } from '@angular/common';
    import { NgForOf } from '@angular/common';
    import { NgChartsModule } from 'ng2-charts';
    import { FormControl, ReactiveFormsModule } from '@angular/forms';
    
    @Component({
      selector: 'app-dashboard',
      // import { Component, OnInit } from '@angular/core';
  standalone: true,
  imports: [CommonModule, NgForOf, NgStyle, NgChartsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats = [
    { label: 'Total Crops', value: '216', color: '#642ECE1A' },
    { label: 'Total Varieties', value: '8338', color: '#FF9F431A' },
    { label: 'Indenters', value: '43', color: '#10AC841A' },
    { label: 'Project Coordinators', value: '23', color: '#0EBEE31A' },
    { label: 'BSPCs', value: '359', color: '#EE61621A' },
    { label: 'SPPs', value: '393', color: '#FF9F431A' },
    { label: 'Seed Testing Labs', value: '386', color: '#0ABDE31A' },
    { label: 'Data As On', value: '07-06-2025', color: '#C7C7C71A' }
  ];

  rightCards = [
  {
    label: 'Inedented Crops',
    value: '239',
    gradient: 'linear-gradient(180deg, #3D4E61 0%, #5A7CA4 100%)',
     valueStyle: {
      'padding-top': '10px',
    }
  },
  {
    label: 'Indented Varieties',
    value: '32',
    gradient: 'linear-gradient(180deg, #4B3C8B 0%, #7866CC 100%)'
  },
  {
    label: 'Indented Quantity',
    value: '43',
    gradient: 'linear-gradient(180deg, #BE3838 0%, #EE5253 100%)'
  },
  {
    label: 'Produced Quantity',
    value: '6753',
    gradient: 'linear-gradient(180deg, #045D5D 0%, #079A9A 100%)'
  },
  {
    label: 'Allocated Quantity',
    value: '43',
    gradient: 'linear-gradient(180deg, #A93B90 0%, #EAA0E0 100%)'
  },
  {
    label: 'Liftede  Quantitiy                  ',
    value: '6615',
    gradient: 'linear-gradient(180deg, #22107D 0%, #3820A8 100%)'
  }
];

  chartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 14,
        boxHeight: 14,
        font: {
          size: 12
        },
        color: '#000'
      }
    },
    tooltip: {
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12 // ✅ cropOptions (X-axis labels)
        },
        color: '#000'
      }
    },
    y: {
      ticks: {
        font: {
          size: 12 // ✅ Y-axis numbers
        },
        color: '#000'
      }
    }
  }
};

horizontalOptions: ChartConfiguration<'bar'>['options'] = {
  indexAxis: 'y',
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 14,
        boxHeight: 14,
        font: {
          size: 10 
        },
        color: '#000'
      }
    },
    tooltip: {
      titleFont: {
        size: 12
      },
      bodyFont: {
        size: 11
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 12 
        },
        color: '#000'
      }
    },
    y: {
      ticks: {
        autoSkip: false,
        font: {
          size: 12
        },
        color: '#000'
      }
    }
  }
  
};




pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
  cutout: '60%',
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        usePointStyle: true,
        pointStyle: 'rect',
        boxWidth: 12, 
        padding: 8,
        font: {
          size: 11
        }
      }
    }
  }
};


  

  // Crop Chart Filter
  cropFilter = new FormControl('');
  cropOptions = ['Soyabean (Bihar)', 'Groundnut', 'Paddy', 'Groundnut', 'Soyabean'];
  allCropChartData = {
    labels: [...this.cropOptions],
    datasets: [
      { data: [4500, 4000, 4200, 3900, 4600], label: 'Indent', backgroundColor: '#8E44AD' },
      { data: [3000, 2800, 3500, 3600, 3900], label: 'Produced', backgroundColor: '#36A2EB' },
      { data: [2800, 2600, 3000, 3100, 3300], label: 'Allocated', backgroundColor: '#FF6384' },
      { data: [2600, 2500, 2900, 3000, 3200], label: 'Lifted', backgroundColor: '#4BC0C0' }
      
    ]
  };
  cropChartData = { ...this.allCropChartData };


    pieData = [
    {
      label: 'Freezed Indent',
      data: [40, 60],
      colors: [' #4BC0C0', '#DF3335']
    },
    {
      label: 'Assigned To PD/PC',
      data: [70, 30],
      colors: [' #4BC0C0', '#DF3335']
    },
    {
      label: 'Production',
      data: [50, 50],
      colors: [' #4BC0C0', '#DF3335']
    },
    {
      label: 'Allocation',
      data: [65, 35],
      colors: [' #4BC0C0', '#DF3335']
    },
    {
      label: 'Lifting',
      data: [45, 55],
      colors: [' #4BC0C0', '#DF3335']
    }
  ];
    pieChartOptions1 = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // BSPC Filter
  bspcFilter = new FormControl('');
  bspcOptions = ['BSPC 1', 'BSPC 2', 'BSPC 3', 'BSPC 4'];
  allBspcChartData = {
    labels: [...this.bspcOptions],
    datasets: [
      { data: [40, 30, 50, 70], label: 'Allotted', backgroundColor: '#4BC0C0' },
      { data: [35, 25, 45, 60], label: 'Production', backgroundColor: '#36A2EB' },
      { data: [30, 20, 40, 55], label: 'Lifted', backgroundColor: '#FF6384' }
    ]
  };
  bspcChartData = { ...this.allBspcChartData };

  // Indenter Filter
  indenterFilter = new FormControl('');
  indenterOptions = ['Tripura', 'MP', 'Bihar', 'NFL'];
  allIndenterChartData = {
    labels: [...this.indenterOptions],
    datasets: [
      { data: [70, 50, 40, 30], label: 'Indent', backgroundColor: '#B0C4DE' },
      { data: [60, 45, 35, 25], label: 'Allocated', backgroundColor: '#D8BFD8' },
      { data: [55, 40, 30, 20], label: 'Lifted', backgroundColor: '#FF69B4' }
      
    ]
  };
  indenterChartData = { ...this.allIndenterChartData };

  // State Filter
  stateFilter = new FormControl('');
  stateOptions = ['Andhra', 'Arunachal', 'Assam', 'Bihar', 'Chhattisgarh'];
  allStateChartData = {
    labels: [...this.stateOptions],
      datasets: [
    {
      label: 'Indented', 
      data: [40, 30, 60, 45, 50],
      backgroundColor: '#5A7CA4'
    },
    {
      label: 'Completed',
      data: [30, 20, 10, 25, 20],
      backgroundColor: '#DF3335'
    },
    {
      label: 'Pending', // top layer
      data: [20, 30, 10, 20, 30],
      backgroundColor: '#4BC0C0'
    }
  ]
  };
  stateChartData = { ...this.allStateChartData };
  

  constructor() {
    this.cropFilter.valueChanges.subscribe(value => {
  this.cropChartData = this.getFilteredChart(this.allCropChartData, value ?? '');
});

    this.bspcFilter.valueChanges.subscribe(value => {
  this.bspcChartData = this.getFilteredChart(this.allBspcChartData, value ?? '');
});

this.indenterFilter.valueChanges.subscribe(value => {
  this.indenterChartData = this.getFilteredChart(this.allIndenterChartData, value ?? '');
});

this.stateFilter.valueChanges.subscribe(value => {
  this.stateChartData = this.getFilteredChart(this.allStateChartData, value ?? '');
});

  }

  getFilteredChart(allData: any, selected: string): any {
  if (!selected) return { ...allData };
  const index = allData.labels.indexOf(selected);
  if (index === -1) return { ...allData };

  return {
    labels: [allData.labels[index]],
    datasets: allData.datasets.map((ds: any) => ({
      ...ds,
      data: [ds.data[index]]
    }))
  };
}

getTextColor(bgColor: string): string {

  if (bgColor.length === 9) {
    return bgColor.slice(0, 7);
  }
  return bgColor;
}
getBottomColor(gradient: string): string {
  const match = gradient.match(/#([A-Fa-f0-9]{6})\s*100%/);
  return match ? `#${match[1]}` : '#FFFFFF';
}
activeSeason = 'Kharif 2025-26';

seasonButtons = [
  'Kharif 2025-26',
  'Rabi 2025-26',
  'Kharif 2024-25',
  'Rabi 2024-25'
];

setActiveSeason(season: string) {
  this.activeSeason = season;
}

}

