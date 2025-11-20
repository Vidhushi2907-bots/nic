
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { CommonModule, NgStyle } from '@angular/common';
import { NgForOf } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SeedServiceService } from 'src/app/services/seed-service.service';
import { BreederService } from 'src/app/services/breeder/breeder.service'
import { from, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ChartOptions, ChartData } from 'chart.js';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-phase-second',
  standalone: true,
  imports: [CommonModule, NgForOf, NgStyle, NgChartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard-phase-second.component.html',
  styleUrls: ['./dashboard-phase-second.component.css']
})
export class DashboardPhaseSecondComponent implements OnInit {
  selectedCropName: string = '';
  selectedBSPCName: string = '';
  selectedIndenterName: string = '';
  selectedStateName: string = '';
  selectedCropGroupName: string = ''
  UserType: boolean = false;
  UserType1: boolean = false;


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // If click is outside the dropdown container, close it
    if (!target.closest('.crop-group-dropdown-container')) {
      this.showCropGroupDropdown = false;
    }
    if (!target.closest('.crop-dropdown-container')) {
      this.showCropDropdown = false;
    }
    if (!target.closest('.bspc-dropdown-container')) {
      this.showDropdown = false;
    }
    if (!target.closest('.indent-dropdown-container')) {
      this.showIndenterDropdown = false;
    }
    if (!target.closest('.state-dropdown-container')) {
      this.showStateDropdown = false;
    }
  }

  stats: any[] = [];

  indenterSearchInput = new FormControl('');
  bspcSearchInput = new FormControl('');
  cropSearchInput = new FormControl('');
  stateSearchInput = new FormControl('');
  cropGroupSearchInput = new FormControl('');
  cropFilter = new FormControl('');
  stateFilter = new FormControl('');
  bspcFilter = new FormControl('');
  indenterFilter = new FormControl('');

  filteredCropOptions: { crop_name: string, crop_code: string }[] = [];
  filteredCropGroupOptions: { group_code: string, group_name: string }[] = [];
  filteredBspcOptions: { bspc_name: string, bspc_id: any }[] = [];
  filteredIndenterOptions: { indentor_name: string, indentor_id: any }[] = [];
  filteredStateOptions: { id: any, state_name: any }[] = [];


  CropWiseFullNames: any[];
  BSPCWiseFullNames: any[];
  IndenterFullNames: any[];
  StateFullNames: any[];





  isCropFullScreen: boolean = false;
  isBSPCFullScreen: boolean = false;
  isIndenterFullScreen: boolean = false;
  isStateFullScreen: boolean = false;


  showDropdown = false;
  showCropDropdown: boolean = false;
  showCropGroupDropdown: boolean = false;
  showStateDropdown: boolean = false;
  showIndenterDropdown = false;


  cropOptions: string[] = [];
  stateOptions: string[] = [];
  bspcOptions: string[] = [];
  indenterOptions: string[] = [];

  allCropChartData: any = {
    labels: [],
    datasets: []
  };
  stateChartData: any;
  cropChartData: any = {};
  bspcChartData: any;
  indenterChartData: any;

  allBspcChartData: any;
  allIndenterChartData: any;
  allStateChartData: any;

  seasonButtons: string[] = [];
  activeSeasonData: string = '';
  activeSeason = 'K';
  activeYear = new Date().getFullYear().toString();
  rightCards: any;
  pieData: any[] = [];

  StateDataList: any[];
  cropDataList: any[];
  BspcDataList: any[]
  IndentorDataList: any[]
  croupGroupList: any = [];

  selectedStateId: number | null = null;

  selected_group: any;
  croupGroupListsecond: any;
  activeCropGroup: any;
  activeCropGroupName: any;

  graphType: any;
  crop_type = 'A';

  clickedData: { [key: string]: string } = {};
  cd: any;


  // Fullscreen Toggle Function
  toggleFullscreen() {
    const chartContainer = document.getElementById('chartContainer');
    if (document.fullscreenElement) {
      this.isCropFullScreen = false

      document.exitFullscreen();
    } else {
      this.isCropFullScreen = true

      chartContainer?.requestFullscreen();

    }
  }
  toggleBSPCFullscreen() {
    const chartContainer = document.getElementById('chartBSPCContainer');
    if (document.fullscreenElement) {
      this.isBSPCFullScreen = false

      document.exitFullscreen();
    } else {
      this.isBSPCFullScreen = true

      chartContainer?.requestFullscreen();

    }
  }
  toggleIndenterFullscreen() {
    const chartContainer = document.getElementById('chartIndenterContainer');
    if (document.fullscreenElement) {
      this.isIndenterFullScreen = false

      document.exitFullscreen();
    } else {
      this.isIndenterFullScreen = true

      chartContainer?.requestFullscreen();

    }
  }
  toggleStateFullscreen() {
    const chartContainer = document.getElementById('chartStateContainer');
    if (document.fullscreenElement) {
      this.isStateFullScreen = false

      document.exitFullscreen();
    } else {
      this.isStateFullScreen = true

      chartContainer?.requestFullscreen();

    }
  }

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false
      },
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
        },
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return this.CropWiseFullNames[index] || '';
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12 //  cropOptions (X-axis labels)
          },
          color: '#000'
        }
      },
      y: {
        ticks: {
          font: {
            size: 12 //  Y-axis numbers
          },
          color: '#000'
        }
      }
    },
    datasets: { bar: { barThickness: 8 } }
  };
  bspcChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false
      },
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
        },
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return this.BSPCWiseFullNames[index] || '';
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12 //  cropOptions (X-axis labels)
          },
          color: '#000'
        }
      },
      y: {
        ticks: {
          font: {
            size: 12 //  Y-axis numbers
          },
          color: '#000'
        }
      }
    },
    datasets: { bar: { barThickness: 10 } }
  };
  pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    cutout: '60%',
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${value} (${percentage}%)`;
        },
        font: {
          weight: 'bold',
          size: 11,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label} ${value}%`;
          }
        }
      }
    },
  };
  getPieChartOptions(pie: any): ChartConfiguration<'doughnut'>['options'] {
    return {
      responsive: true,
      cutout: '40%',
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          // Dynamic color function based on slice background brightness
          color: (context) => {
            const index = context.dataIndex;
            const bgColor = pie.colors[index];

            // Function to calculate brightness from HEX
            const hexToRgb = (hex) => {
              hex = hex.replace('#', '');
              const bigint = parseInt(hex, 16);
              const r = (bigint >> 16) & 255;
              const g = (bigint >> 8) & 255;
              const b = bigint & 255;
              return { r, g, b };
            };

            const rgb = hexToRgb(bgColor);
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

            // Return black text for light colors, white text for dark colors
            return brightness > 125 ? '#000000' : '#FFFFFF';
          },
          anchor: 'center' as const,
          align: 'center' as const,
          formatter: (value, context) => {
            const index = context.dataIndex;
            const selectedType = pie.selectedType;

            if (selectedType === 'Pending' && index === 0) {
              return `${pie.pendingInPercentage}%`;
            } else if (selectedType === 'Completed' && index === 1) {
              return `${pie.completedInPercentage}%`;
            } else if (!selectedType) {
              // Show both by default if nothing clicked yet
              if (index === 0) {
                return `${pie.pendingInPercentage}%`;
              } else if (index === 1) {
                return `${pie.completedInPercentage}%`;
              }
            }
            return ''; // hide label if not matching selected type
          },
          font: {
            weight: 'bold' as const,
            size: 10
          },
          padding: 0,
          offset: 0,
          clamp: true,
          clip: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.formattedValue || '';
              return `${label}: ${value}%`;
            }
          }
        }
      }
    };
  }
  horizontalOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        barThickness: 15, // Increased thickness
        maxBarThickness: 25,
        categoryPercentage: 0.5,
        barPercentage: 0.9
      }
    },
    plugins: {
      datalabels: {
        display: false
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          font: { size: 10 },
          color: '#000'
        }
      },
      tooltip: {
        // callbacks: {
        //   label: function(context) {
        //     return context.dataset.label + ': ' + context.parsed.x;
        //   }
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return this.IndenterFullNames[index] || '';
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          color: '#000'
        }
      },
      y: {
        ticks: {
          autoSkip: false,
          font: { size: 12 },
          color: '#000'
        }
      }
    }
  };
  areaShownChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    datasets: { bar: { barThickness: 15 } },
    plugins: {
      datalabels: {
        display: false
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          font: {
            size: 12
          },
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return this.StateFullNames[index] || '';
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: { size: 12 },
          color: '#000'
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: '#000'
        }
      }
    }

  };
  showCropWiseDownloadMenu = false;
  showBSPCWiseDownloadMenu = false;
  showIndenterDownloadMenu = false;
  showStateDownloadMenu = false;



  selectedCropCode: any
  selectedBSPCId: any
  selectedIndenterId: any;
  selectedStateIds: any;
  selectedStateNames: any;




  toggleCropDownloadMenu() {
    this.showCropWiseDownloadMenu = !this.showCropWiseDownloadMenu;
  }
  toggleBSPCDownloadMenu() {
    this.showBSPCWiseDownloadMenu = !this.showBSPCWiseDownloadMenu;
  }

  toggleIndenterDownloadMenu() {
    this.showIndenterDownloadMenu = !this.showIndenterDownloadMenu;
  }
  toggleStateDownloadMenu() {
    this.showStateDownloadMenu = !this.showStateDownloadMenu;
  }

  @ViewChild('CropWisemenu') menuCropRef!: ElementRef;
  @ViewChild('BSPCWisemenu') menuBSPCRef!: ElementRef;
  @ViewChild('Indentermenu') menuIndenterRef!: ElementRef;
  @ViewChild('Statemenu') menuStateRef!: ElementRef;


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Close CropWise menu if clicked outside
    if (
      this.showCropWiseDownloadMenu &&
      this.menuCropRef &&
      !this.menuCropRef.nativeElement.contains(target)
    ) {
      this.showCropWiseDownloadMenu = false;
    }

    // Close BSPCWise menu if clicked outside
    if (
      this.showBSPCWiseDownloadMenu &&
      this.menuBSPCRef &&
      !this.menuBSPCRef.nativeElement.contains(target)
    ) {
      this.showBSPCWiseDownloadMenu = false;
    }
    // Close Inderter menu if clicked outside
    if (
      this.showIndenterDownloadMenu &&
      this.menuIndenterRef &&
      !this.menuIndenterRef.nativeElement.contains(target)
    ) {
      this.showIndenterDownloadMenu = false;
    }
    if (
      this.showStateDownloadMenu &&
      this.menuStateRef &&
      !this.menuStateRef.nativeElement.contains(target)
    ) {
      this.showStateDownloadMenu = false;
    }
  }

  //DownLoad Code
  @ViewChild('cropWiseAres') captureCropWiseArea!: ElementRef;
  @ViewChild('BSPCWiseAres') captureBSPCWiseArea!: ElementRef;
  @ViewChild('IndenterAres') captureIndenterArea!: ElementRef;
  @ViewChild('StateAres') captureStateArea!: ElementRef;




  constructor(private service: SeedServiceService, private breederService: BreederService) {
  }

  ngOnInit(): void {
    document.addEventListener('fullscreenchange', () => {
      this.isCropFullScreen = !!document.fullscreenElement;
    });
    document.addEventListener('fullscreenchange', () => {
      this.isBSPCFullScreen = !!document.fullscreenElement;
    });
    document.addEventListener('fullscreenchange', () => {
      this.isIndenterFullScreen = !!document.fullscreenElement;
    });
    document.addEventListener('fullscreenchange', () => {
      this.isStateFullScreen = !!document.fullscreenElement;
    });

    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));


    // Determine graph type based on user_type
    switch (currentUser.user_type) {
      case 'SD':
        this.graphType = 'seed-devision';
        break;
      case 'IN':
        this.graphType = 'indenter';
        break;
      case 'HICAR':
      case 'ICAR':
        this.graphType = 'nodal';
        break;
      case 'OILSEEDADMIN':
        this.graphType = 'oil-seeds';
        this.UserType = true;
        this.activeCropGroup = 'A04'

        break;

      case 'PULSESSEEDADMIN':
        this.graphType = 'pulses-seeds';
        this.UserType1 = true;
        this.activeCropGroup = 'A03'

        break;
      case 'BPC':
        this.graphType = 'bspc';
        break;
      default:
        this.graphType = '';
    }

    this.crop_type = currentUser.user_type == 'HICAR' ? 'H' : 'A';

    // Initialize and subscribe Crop Group search input
    this.cropGroupSearchInput = new FormControl('');
    this.cropGroupSearchInput.valueChanges.subscribe(value => {
      this.filterCropGroupOptions(value);
    });


    // Crop wise total indents and liftings Start
    this.cropSearchInput = new FormControl('');
    this.cropSearchInput.valueChanges.subscribe(value => {
      this.filterCropOptions(value);
    });
    this.getCropWiseChartData(this.activeSeason, this.activeYear);

    // BSPC Start
    this.bspcSearchInput = new FormControl('');
    this.bspcSearchInput.valueChanges.subscribe(value => {
      this.filterBSPCOptions(value);
    });
    this.getCropWiseChartData(this.activeSeason, this.activeYear);

    // Indenter Start
    this.indenterSearchInput = new FormControl('');
    this.indenterSearchInput.valueChanges.subscribe(value => {
      this.filterIndentorOptions(value);
    });
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear);

    // State Start
    this.stateSearchInput = new FormControl('');
    this.stateSearchInput.valueChanges.subscribe(value => {
      this.filterStateOptions(value);
    });
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear);

    // Initial data fetch calls
    this.getCardData();
    this.getCropGroupData();
    this.getSeasonButtonsFromBackend();
    this.getCropDataList(this.activeSeason, this.activeYear);
    this.getCropWiseChartData(this.activeSeason, this.activeYear);
    this.getRightCards(this.activeSeason, this.activeYear);
    this.getDonutChartData(this.activeSeason, this.activeYear);
    this.getBspcDataList(this.activeSeason, this.activeYear);
    this.getBSPCWiseChartData(this.activeSeason, this.activeYear);
    this.getIndentorDataList(this.activeSeason, this.activeYear);
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear);
    this.getStateDataList(this.activeSeason, this.activeYear);
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear);

    // State Filter Chart Update
    this.stateFilter.valueChanges.subscribe(selected => {
      if (!selected) {
        this.stateChartData = { ...this.allStateChartData };
      } else {
        const index = this.stateOptions.indexOf(selected);
        this.stateChartData = {
          labels: [this.stateOptions[index]],
          datasets: this.allStateChartData.datasets.map((ds: any) => ({
            ...ds,
            data: [ds.data[index]]
          }))
        };
      }
    });

    // Crop Filter Chart Update
    this.cropFilter.valueChanges.subscribe(selectedCrop => {
      if (selectedCrop) {
        const index = this.allCropChartData.labels.indexOf(selectedCrop);
        if (index > -1) {
          this.cropChartData = {
            labels: [this.allCropChartData.labels[index]],
            datasets: this.allCropChartData.datasets.map(ds => ({
              ...ds,
              data: [ds.data[index]]
            }))
          };
        }
      } else {
        this.cropChartData = { ...this.allCropChartData };
      }
    });

    // BSPC Filter Chart Update
    this.bspcFilter.valueChanges.subscribe(selectedBspc => {
      if (selectedBspc) {
        const index = this.allBspcChartData.labels.indexOf(selectedBspc);
        if (index > -1) {
          this.bspcChartData = {
            labels: [this.allBspcChartData.labels[index]],
            datasets: this.allBspcChartData.datasets.map(ds => ({
              ...ds,
              data: [ds.data[index]]
            }))
          };
        }
      } else {
        this.bspcChartData = { ...this.allBspcChartData };
      }
    });

    // Indenter Filter Chart Update
    this.indenterFilter.valueChanges.subscribe(selectedIndentor => {
      if (selectedIndentor) {
        const index = this.allIndenterChartData.labels.indexOf(selectedIndentor);
        if (index > -1) {
          this.indenterChartData = {
            labels: [this.allIndenterChartData.labels[index]],
            datasets: this.allIndenterChartData.datasets.map(ds => ({
              ...ds,
              data: [ds.data[index]]
            }))
          };
        }
      } else {
        this.indenterChartData = { ...this.allIndenterChartData };
      }
    });
  }


  getStateChartCanvasWidth(): number {
    const records = this.stateChartData?.labels?.length || 0;
    const barGroupWidth = 120; // px per record group including spacing

    // Show 5 records in container width, scroll for more
    return records <= 5 ? 600 : records * barGroupWidth;
  }
  getStateChartCanvasWidthFullScreen(): number {
    const records = this.stateChartData?.labels?.length || 0;
    const barGroupWidth = 125; // px per record group including spacing

    // Show 5 records in container width, scroll for more
    return records <= 5 ? 2100 : records * barGroupWidth;
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
  // dashboard-phase-second.component.ts
  openLink(link: string | undefined, disabled: boolean) {
    if (!disabled && link) {
      window.open(link, '_blank');
    }
  }

  getCardData() {
    let param = {
      search: {
        crop_type: "A",
        graphType: this.graphType
      }
    };
    this.service.postRequestCreator('get-dashboard-item-count', null, param).subscribe((data: any) => {
      const cardData = data.EncryptedResponse?.data;
      if (data && data.EncryptedResponse?.status_code === 200 && Array.isArray(cardData)) {
        this.stats = [
          { label: 'Total Crops', value: cardData[0]?.total_crop || '0', color: '#642ECE1A', img: 'cropCard.svg', link: `${environment.baseUrl}/crop-statistics` },//old link add-crop-report
          { label: 'Total Varieties', value: cardData[1]?.total_variety || '0', color: '#FF9F431A', img: 'bell.svg', link: `${environment.baseUrl}/variety-report-list` },
          { label: 'Indenters', value: cardData[2]?.total_indenter || '0', color: '#10AC841A', img: 'indent_2.svg', link: `${environment.baseUrl}/list-of-indentors-report` },
          { label: 'Project Coordinators', value: cardData[3]?.total_icar || '0', color: '#0EBEE31A', img: 'layer1.svg', link: `${environment.baseUrl}/breeder-production-report` },
          { label: 'BSPCs', value: cardData[4]?.total_bpc || '0', color: '#EE61621A', img: 'wash.svg', link: `${environment.baseUrl}/list-of-breeder-seed-production-center-report` },
          { label: 'SPPs', value: cardData[5]?.total_spp || '0', color: '#FF9F431A', img: 'bell.svg', link: `${environment.baseUrl}/spp-report` },
          { label: 'Seed Testing Labs', value: cardData[6]?.total_lab || '0', color: '#0ABDE31A', img: 'layer1.svg', link: `${environment.baseUrl}/dashboard-phase-second`, disabled: true },
          // { label: 'Data As On', value: new Date().toLocaleDateString('en-IN'), color: '#FF9F431A' }
        ];
      } else {
      }
    }, (err) => {
      console.error(" Error fetching dashboard card data:", err);
    });
  }
  getSeasonButtonsFromBackend() {
    this.service.getRequestCreator('find-latest-year-season').subscribe((data: any) => {
      if (data.EncryptedResponse.status_code == 200) {
        this.seasonButtons = data.EncryptedResponse.data;
        this.activeSeasonData = data.EncryptedResponse.data[0];
      }
    });
  }
  setActiveSeason(season: string) {
    this.activeSeasonData = season;
    const [seasonName, yearRange] = this.activeSeasonData.split(' ');
    this.activeSeason = seasonName?.charAt(0) || '';
    this.activeYear = yearRange?.split('-')[0] || '';
    this.getCropDataList(this.activeSeason, this.activeYear);
    this.getCropWiseChartData(this.activeSeason, this.activeYear);
    this.getRightCards(this.activeSeason, this.activeYear);
    this.getDonutChartData(this.activeSeason, this.activeYear);
    this.getBspcDataList(this.activeSeason, this.activeYear);
    this.getBSPCWiseChartData(this.activeSeason, this.activeYear);
    this.getIndentorDataList(this.activeSeason, this.activeYear);
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear);
    this.getStateDataList(this.activeSeason, this.activeYear);
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear);

    this.selectedCropName = ''
    this.selectedBSPCName = ''
    this.selectedIndenterName = ''
    this.selectedStateName = ''

  }

  onLegendClick(type: string, pie: any) {
    pie.selectedType = type; // ⭐ store which slice is selected

    if (type === 'Pending') {
      pie.data = [pie.pending, 0]; // show only pending
    } else if (type === 'Completed') {
      pie.data = [0, pie.completed]; // show only completed
    } else {
      pie.data = [pie.pending, pie.completed]; // show both if needed
    }

    this.cd.detectChanges(); // refresh view
  }

  getDonutChartData(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,

      }
    };

    const apiConfigs = [
      { url: 'get-freezed-indent-donut-chart-data', label: 'Freezed Indent' },
      { url: 'get-assign-to-PD-PC-donut-chart-data', label: 'Assigned To PD/PC' },
      { url: 'get-production-donut-chart-data', label: 'Production' },
      { url: 'get-allocation-donut-chart-data', label: 'Allocation' },
      { url: 'get-lifting-donut-chart-data', label: 'Lifting' }
    ];

    const chartColors = ['#DF3335', '#4BC0C0'];
    this.pieData = [];
    from(apiConfigs)
      .pipe(
        concatMap(api =>
          this.service.postRequestCreator(api.url, null, payload).pipe(
            map((res: any) => ({ res, api })),
            catchError(err => {
              console.error(`${api.label} API Error:`, err);
              return of({ res: null, api });
            })
          )
        )
      )
      .subscribe({
        next: ({ res, api }) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && data) {
            const pending = data.pendingInPercentage || 0;
            const completed = data.completedInPercentage || 0;
            if (pending === 0 && completed === 0) {
              this.pieData.push({
                label: api.label,
                noData: true
              });
            } else {
              this.pieData.push({
                label: api.label,
                data: [pending, completed],
                completed: data.completed,
                pending: data.pending,
                completedInPercentage: completed,
                pendingInPercentage: pending,
                colors: chartColors,
                noData: false
              });
            }
          } else {
            console.warn(`${api.label} No Data Found`);
            this.pieData.push({
              label: api.label,
              noData: true
            });
          }
        },
        error: (err) => {
          console.error('Unexpected error in donut chart API sequence:', err);
        },
        complete: () => {
          console.log('All donut chart APIs called sequentially.');
        }
      });
  }


  getRightCards(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        crop_code: null,
        crop_group: this.activeCropGroup,
      }
    };

    this.breederService.postRequestCreator('get-freeze-recieved-indent-quntity', null, payload).subscribe(
      (res: any) => {
        const d = res?.EncryptedResponse?.data;
        if (res?.EncryptedResponse?.status_code === 200 && d) {
          this.rightCards = [
            {
              label: 'Indented',
              labelSecond: 'Crops',
              value: parseInt(d.indented_crop, 10),
              gradient: 'linear-gradient(180deg, #3D4E61 0%, #5A7CA4 100%)'
            },
            {
              label: 'Indented',
              labelSecond: 'Varieties',
              value: parseInt(d.indented_variety, 10),
              gradient: 'linear-gradient(180deg, #4B3C8B 0%, #7866CC 100%)'
            },
            {
              label: 'Indented',
              labelSecond: 'Quantity (Qt)',
              value: Number(d.indented_quantity) % 1 === 0
                ? Number(d.indented_quantity)
                : Number(d.indented_quantity).toFixed(2),
              gradient: 'linear-gradient(180deg, #BE3838 0%, #EE5253 100%)'
            },
            {
              label: 'Produced',
              labelSecond: 'Quantity (Qt)',
              value: Number(d.produced_quantity) % 1 === 0
                ? Number(d.produced_quantity)
                : Number(d.produced_quantity).toFixed(2),
              gradient: 'linear-gradient(180deg, #045D5D 0%, #079A9A 100%)'
            },
            {
              label: 'Allocated',
              labelSecond: 'Quantity (Qt)',
              value: Number(d.allocated_quantity) % 1 === 0
                ? Number(d.allocated_quantity)
                : Number(d.allocated_quantity).toFixed(2),
              gradient: 'linear-gradient(180deg, #A93B90 0%, #EAA0E0 100%)'
            },
            {
              label: 'Lifted',
              labelSecond: 'Quantity (Qt)',
              value: Number(d.lifted_quantity) % 1 === 0
                ? Number(d.lifted_quantity)
                : Number(d.lifted_quantity).toFixed(2),
              gradient: 'linear-gradient(180deg, #22107D 0%, #3820A8 100%)'
            }
          ];
        } else {
          this.rightCards = [];
          console.warn(' Right Cards data not found.');
        }
      },
      (err) => {
        console.error(' Error loading right cards:', err);
      }
    );
  }

  // =====================
  // Code for Crop Group
  // =====================

  toggleCropGroupDropdown1() {
    this.showCropGroupDropdown = !this.showCropGroupDropdown;
  }
  selectAllCropGroupOption() {
    this.selectedCropGroupName = 'All';
    this.cropGroupSearchInput.setValue('All');
    this.filteredCropGroupOptions = [...this.croupGroupList]; // reset filter to all crops
    this.showCropGroupDropdown = false; // close dropdown if needed
    this.activeCropGroup = null
    this.setActiveSeason('Kharif 2025-26');

    this.selectedCropName = ''
    this.selectedBSPCName = ''
    this.selectedIndenterName = ''
    this.selectedStateName = ''
  }

  toggleCropGroupDropdown() {
    this.showCropGroupDropdown = !this.showCropGroupDropdown;
    if (this.showCropGroupDropdown) {
      this.cropGroupSearchInput.setValue('');
      this.filteredCropGroupOptions = [...this.croupGroupList];
    }
  }

  getCropGroupData() {
    const route = "crop-group";
    const result = this.service.postRequestCreator(route, null).subscribe(data => {
      this.croupGroupList = data && data.EncryptedResponse && data.EncryptedResponse.data ? data.EncryptedResponse.data : '';
      this.filteredCropGroupOptions = this.croupGroupList
    })
  }


  group_select(data: any): void {
    this.selected_group = data.group_name;
    this.selectedCropGroupName = data.group_name;
    this.showCropGroupDropdown = false;
    // Safely set form values
    // this.ngForm.controls['group_code'].setValue(data.group_code);
    this.cropGroupSearchInput.setValue(data.group_name);
    this.activeCropGroup = data.group_code
    this.activeCropGroupName = data.group_name
    setTimeout(() => {
      this.setActiveSeason('Kharif 2025-26');
    }, 1000);

    this.selectedCropName = ''
    this.selectedBSPCName = ''
    this.selectedIndenterName = ''
    this.selectedStateName = ''

  }


  filterCropGroupOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredCropGroupOptions = [...this.croupGroupList];
      this.cropChartData = { ...this.allCropChartData };
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    this.filteredCropGroupOptions = this.croupGroupList.filter(cropGroup =>
      cropGroup.group_name.toLowerCase().includes(lowerSearch)
    );

    const filteredIndexes = this.croupGroupList
      .map((cropGroup, index) =>
        cropGroup.group_name.toLowerCase().includes(lowerSearch) ? index : -1
      )
      .filter(index => index !== -1);

  }


  // =====================
  // Code for Crop Group
  // =====================


  // =====================
  // Code for Crop wise total indents and liftings Start
  // =====================

  getCropWiseChartCanvasWidth(): number {
    const records = this.cropChartData?.labels?.length || 0;
    const barGroupWidth = 100; // px per record group including spacing
    // Show 5 records in container width, scroll for more
    return records <= 5 ? 600 : records * barGroupWidth;
  }

  getCropWiseChartCanvasWidthFullScreen(): number {
    const records = this.cropChartData?.labels?.length || 0;
    const barGroupWidth = 125; // px per record group including spacing
    // Show 5 records in container width, scroll for more
    return records <= 5 ? 1900 : records * barGroupWidth;
  }

  toggleCropDropdown() {
    this.showCropDropdown = !this.showCropDropdown;

    if (this.showCropDropdown) {
      // When dropdown opens, clear search input to show full list
      this.cropSearchInput.setValue('');
      this.filteredCropOptions = [...this.cropDataList];
    }
  }

  selectCropOption(crop: { crop_name: string, crop_code: string }): void {
    this.selectedCropName = crop.crop_name; // ✅ Save selected name separately
    this.cropSearchInput.setValue(crop.crop_name);
    this.showCropDropdown = false;

    const crop_code = crop.crop_code;
    this.selectedCropCode = crop.crop_code
    const crop_name = crop.crop_name;

    this.getCropWiseChartData(this.activeSeason, this.activeYear, crop_code, crop_name);
  }

  selectAllCropOption() {
    this.selectedCropName = 'All'; // ✅ update selected name
    this.cropSearchInput.setValue('All');
    this.filteredCropOptions = [...this.cropDataList]; // reset filter to all crops
    this.cropChartData = { ...this.allCropChartData }; // reset chart to all data
    this.showCropDropdown = false;
    this.getCropWiseChartData(this.activeSeason, this.activeYear, null);
  }

  filterCropOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredCropOptions = Array.isArray(this.cropDataList) ? [...this.cropDataList] : [];;
      this.cropChartData = { ...this.allCropChartData };
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    this.filteredCropOptions = this.cropDataList.filter(crop =>
      crop.crop_name.toLowerCase().includes(lowerSearch)
    );

    const filteredIndexes = this.cropDataList
      .map((crop, index) =>
        crop.crop_name.toLowerCase().includes(lowerSearch) ? index : -1
      )
      .filter(index => index !== -1);

    this.cropChartData = {
      labels: filteredIndexes.map(i => this.cropDataList[i].crop_name),
      datasets: this.allCropChartData.datasets.map(ds => ({
        ...ds,
        data: filteredIndexes.map(i => ds.data[i])
      }))
    };
  }

  getCropDataList(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
      }
    };

    this.service.postRequestCreator('get-chart-indent-crop-wise-crop-list', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200) {
            this.cropDataList = data;
          } else {
            this.cropDataList = [];
            console.warn('Crop List Data not found.');
          }
        },
        (err) => {
          console.error('Error fetching Crop List data:', err);
        }
      );
  }

  getCropWiseChartData(activeSeason: any, activeYear: any, crop_code: any | null = null, crop_name: any | null = null): void {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(crop_code !== null && { crop_code: crop_code })
      }
    };

    const apiEndpoint = crop_code !== null
      ? 'get-chart-indent-crop-to-variety-wise'
      : 'get-chart-indent-crop-wise';

    this.service.postRequestCreator(apiEndpoint, null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && Array.isArray(data)) {
            // ✅ If data exists but first item has null variety_code and variety_name, show blank chart
            if (crop_code !== null && data.length === 1 && data[0].variety_code === null && data[0].variety_name === null) {
              this.cropChartData = {
                labels: [],
                datasets: []
              };
              this.cropOptions = [];
              this.cropSearchInput.setValue('');
              console.warn('No variety data found, blank chart shown');
              return;
            }
            // ✅ Prepare Names based on condition
            // const Names = data.map((item: any) => {
            //   const name = crop_code ? (item.variety_name || '') : (item.crop_name || '');
            //   return name.length > 8 ? name.substring(0, 8) + '...' : name;
            // });
            const Names = data.map((item: any) => {
              const fullName = crop_code ? (item.variety_name || '') : (item.crop_name || '');
              return fullName.length > 8 ? fullName.substring(0, 8) + '...' : fullName;
            });
            this.CropWiseFullNames = data.map((item: any) => crop_code ? (item.variety_name || '') : (item.crop_name || ''));

            // this.cropSearchInput.setValue('');
            this.cropSearchInput.setValue(crop_name);

            this.cropOptions = [...Names];

            this.allCropChartData = {
              labels: Names,
              datasets: [
                {
                  data: data.map((item: any) => item.total_indent_quantity || 0),
                  label: 'Indent',
                  backgroundColor: '#FF6384'
                },
                {
                  data: data.map((item: any) => item.total_produced_quantity || 0),
                  label: 'Produced',
                  backgroundColor: '#36A2EB'
                },
                {
                  data: data.map((item: any) => item.total_allocate_quantity || 0),
                  label: 'Allocated',
                  backgroundColor: '#8E44AD'
                },
                {
                  data: data.map((item: any) => item.total_lifted_quantity || 0),
                  label: 'Lifted',
                  backgroundColor: '#4BC0C0'
                }
              ]
            };
            this.cropChartData = { ...this.allCropChartData };
          } else {
            this.cropChartData = { labels: [], datasets: [] };
            console.warn('Crop chart data not found, blank chart shown');
          }
        },
        err => {
          console.error('Crop-wise chart API Error:', err);
          this.cropChartData = { labels: [], datasets: [] };
        }
      );
  }

  downloadCropWisePng() {
    const element = this.captureCropWiseArea.nativeElement;
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'Crop_wise_total_indents_and_liftings.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadCropWiseExcle(): void {
    // const crop_code = this.selectedCropCode ?? null;
    const crop_code = this.selectedCropName === "All" ? null : this.selectedCropCode ?? null;
    const crop_name = this.selectedCropName ?? null;
    const activeSeason = this.activeSeason;
    const activeYear = this.activeYear;

    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(crop_code !== null && { crop_code: crop_code })
      }
    };

    const apiEndpoint = crop_code !== null
      ? 'get-chart-indent-crop-to-variety-wise'
      : 'get-chart-indent-crop-wise';

    this.service.postRequestCreator(apiEndpoint, null, payload)
      .subscribe((res: any) => {
        const data = res?.EncryptedResponse?.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data found to export.");
          return;
        }

        const wb = XLSX.utils.book_new();
        let ws: XLSX.WorkSheet;

        if (crop_code === null) {
          const sheetData = [
            ["Crop wise total indents and liftings (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["Crop", "Indent", "Produced", "Allocated", "Lifted"],
            ...data.map((item: any) => [
              item.crop_name,
              item.total_indent_quantity || 0,
              item.total_produced_quantity || 0,
              item.total_allocate_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);

        } else {
          const cropLabel = data[0]?.crop_name || this.selectedCropName;
          const sheetData = [
            ["Crop wise total indents and liftings (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["Crop"],
            [cropLabel],
            [],
            ["Variety Name", "Indent", "Produced", "Allocated", "Lifted"],
            ...data.map((item: any) => [
              item.variety_name,
              item.total_indent_quantity || 0,
              item.total_produced_quantity || 0,
              item.total_allocate_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);
        }

        XLSX.utils.book_append_sheet(wb, ws, "Crop Data");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `Crop_wise_total_indents_and_liftings-${Date.now()}.xlsx`);
      });
  }

  // =====================
  // Code for Crop wise total indents and liftings Ends
  // =====================



  // =====================
  // Code for BSPC Wise Production Summary Start
  // =====================

  getChartCanvasWidth(): number {
    const records = this.bspcChartData?.labels?.length || 0;
    const barGroupWidth = 120; // px per record group including spacing

    // Show 5 records in container width, scroll for more
    return records <= 5 ? 600 : records * barGroupWidth;
  }

  getChartCanvasWidthFullScreen(): number {
    const records = this.bspcChartData?.labels?.length || 0;
    const barGroupWidth = 125; // px per record group including spacing
    return records <= 5 ? 2100 : records * barGroupWidth;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      // When dropdown opens, clear search input to show full list
      this.bspcSearchInput.setValue('');
      this.filteredBspcOptions = [...this.BspcDataList];
      // this.bspcChartData = []
    }
  }

  selectBspcOption(bspc: { bspc_name: string, bspc_id: any }): void {
    this.selectedBSPCName = bspc.bspc_name;
    this.bspcSearchInput.setValue(bspc.bspc_name);
    this.showDropdown = false;
    const bspc_id = bspc.bspc_id;
    this.selectedBSPCId = bspc.bspc_id;

    const bspc_name = bspc.bspc_name;
    this.getBSPCWiseChartData(this.activeSeason, this.activeYear, bspc_id, bspc_name);
  }

  selectAllBspcOption() {
    this.selectedBSPCName = 'All'; // ✅ update selected name
    this.bspcSearchInput.setValue('All');
    this.filteredBspcOptions = [...this.BspcDataList]; // reset filter to all crops
    this.bspcChartData = { ...this.allBspcChartData }; // reset chart to all data
    this.showDropdown = false;
    this.getBSPCWiseChartData(this.activeSeason, this.activeYear, null);
  }

  filterBSPCOptions(searchTerm: string) {
    if (!searchTerm) {
      this.filteredBspcOptions = Array.isArray(this.BspcDataList) ? [...this.BspcDataList] : [];
      this.bspcChartData = { ...this.allBspcChartData };
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    this.filteredBspcOptions = this.BspcDataList.filter(bspc =>
      bspc.bspc_name.toLowerCase().includes(lowerSearch)
    );

    const filteredIndexes = this.BspcDataList
      .map((bspc, index) =>
        bspc.bspc_name.toLowerCase().includes(lowerSearch) ? index : -1
      )
      .filter(index => index !== -1);

    this.bspcChartData = {
      labels: filteredIndexes.map(i => this.BspcDataList[i].bspc_name),
      datasets: this.allBspcChartData.datasets.map(ds => ({
        ...ds,
        data: filteredIndexes.map(i => ds.data[i])
      }))
    };
  }

  getBspcDataList(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
      }
    };

    this.breederService.postRequestCreator('get-chart-bspc-wise-crop-list', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (
            res?.EncryptedResponse?.status_code === 200 &&
            Array.isArray(data) &&
            data.length > 0 &&
            data[0].user_id !== null &&
            data[0].bspc_name !== null
          ) {
            this.BspcDataList = data;
            this.filteredBspcOptions = data

          } else {
            this.BspcDataList = [];
            this.filteredBspcOptions = []
            console.warn('BSPC Data not found or contains null values.');
          }
        },
        (err) => {
          console.error('Error fetching BSPC data:', err);
        }
      );
  }


  getBSPCWiseChartData(activeSeason: any, activeYear: any, bspc_id: any | null = null, bspc_name: any | null = null): void {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(bspc_id !== null && { bspc_id: bspc_id })

      }
    };

    const apiEndpoint = bspc_id !== null
      ? 'get-chart-bspc-to-crop-wise'
      : 'get-chart-bspc-wise';

    this.breederService.postRequestCreator(apiEndpoint, null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && Array.isArray(data)) {
            // ✅ If data exists but first item has null variety_code and variety_name, show blank chart
            if (bspc_id !== null && data.length === 1 && data[0].variety_code === null && data[0].variety_name === null) {
              this.bspcChartData = {
                labels: [],
                datasets: []
              };
              this.bspcOptions = [];
              this.bspcSearchInput.setValue('');
              console.warn('No variety data found, blank chart shown');
              return;
            }

            // ✅ Prepare Names based on condition
            // const Names = data.map((item: any) => {
            //   const name = bspc_id ? (item.crop_name || '') : (item.bspc_name || '');
            //   return name.length > 10 ? name.substring(0, 10) + '...' : name;
            // });

            const Names = data.map((item: any) => {
              const fullName = bspc_id ? (item.crop_name || '') : (item.bspc_name || '');
              return fullName.length > 8 ? fullName.substring(0, 8) + '...' : fullName;
            });
            this.BSPCWiseFullNames = data.map((item: any) => bspc_id ? (item.crop_name || '') : (item.bspc_name || ''));
            this.bspcSearchInput.setValue(bspc_name);
            this.bspcOptions = [...Names];

            this.allBspcChartData = {
              labels: Names,
              datasets: [
                {
                  data: data.map((item: any) => item.total_target_quantity || 0),
                  label: 'Allotted',
                  backgroundColor: '#ffcd56'
                },
                {
                  data: data.map((item: any) => item.total_production_quantity || 0),
                  label: 'Production',
                  backgroundColor: '#36A2EB'
                },
                {
                  data: data.map((item: any) => item.total_lifted_quantity || 0),
                  label: 'Lifted',
                  backgroundColor: '#4BC0C0'
                }
              ]
            };

            this.bspcChartData = { ...this.allBspcChartData };
          } else {
            this.bspcChartData = { labels: [], datasets: [] };
            console.warn('BSPC chart data not found');
          }
        },
        err => {
          console.error('BSPC-wise chart API Error:', err);
          this.bspcChartData = { labels: [], datasets: [] };

        }
      );
  }

  downloadBSPCWisePng() {
    const element = this.captureBSPCWiseArea.nativeElement;
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'BSPC-wise-production-summary.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadBSPCWiseExcel(): void {
    // const bspc_id = this.selectedBSPCId ?? null;
    const bspc_id = this.selectedBSPCName === "All" ? null : this.selectedBSPCId ?? null;
    const bspc_name = this.selectedBSPCName ?? null;
    const activeSeason = this.activeSeason;
    const activeYear = this.activeYear;

    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(bspc_id !== null && { bspc_id })
      }
    };

    const apiEndpoint = bspc_id !== null
      ? 'get-chart-bspc-to-crop-wise'
      : 'get-chart-bspc-wise';

    this.breederService.postRequestCreator(apiEndpoint, null, payload)
      .subscribe((res: any) => {
        const data = res?.EncryptedResponse?.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data found to export.");
          return;
        }

        const wb = XLSX.utils.book_new();
        let ws: XLSX.WorkSheet;

        if (bspc_id === null) {
          // BSPC-wise sheet
          const sheetData = [
            ["BSPC wise production summary (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["BSPC Name", "Allotted", "Production", "Lifted"],
            ...data.map((item: any) => [
              item.bspc_name || '',
              item.total_target_quantity || 0,
              item.total_production_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);
        } else {
          // Crop-wise under selected BSPC
          const bspcLabel = data[0]?.bspc_name || bspc_name;
          const sheetData = [
            ["BSPC wise production summary (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["BSPC"],
            [bspcLabel],
            [],
            ["Crop Name", "Allotted", "Production", "Lifted"],
            ...data.map((item: any) => [
              item.crop_name || '',
              item.total_target_quantity || 0,
              item.total_production_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);
        }

        XLSX.utils.book_append_sheet(wb, ws, "BSPC Chart");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), ` BSPC-wise-production-summary-${Date.now()}.xlsx`);
      });
  }
  // =====================
  // Code for BSPC Wise Production Summary Ends
  // =====================


  // =====================
  // Indenter wise total indents and lifting Start 
  // =====================


  toggleIndenterDropdown1(): void {
    this.showIndenterDropdown = !this.showIndenterDropdown;
  }
  selectAllIndenterOption1() {
    this.indenterSearchInput.setValue('All');
    this.filteredIndenterOptions = [...this.IndentorDataList]; // reset filter to all crops
    this.indenterChartData = { ...this.allIndenterChartData }; // reset chart to all data
    this.showIndenterDropdown = false; // close dropdown if needed
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear, null);

  }
  selectIndenterOption1(indentor: { indentor_name: string, indentor_id: any }) {
    this.indenterSearchInput.setValue(indentor.indentor_name);
    this.showIndenterDropdown = false;
    const indentor_id = indentor.indentor_id;
    const indentor_name = indentor.indentor_name;
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear, indentor_id, indentor_name);
  }


  toggleIndenterDropdown() {
    this.showIndenterDropdown = !this.showIndenterDropdown;
    if (this.showIndenterDropdown) {
      // When dropdown opens, clear search input to show full list
      this.indenterSearchInput.setValue('');
      this.filteredIndenterOptions = [...this.IndentorDataList];
    }
  }

  selectIndenterOption(indentor: { indentor_name: string, indentor_id: any }): void {
    this.selectedIndenterName = indentor.indentor_name;
    this.indenterSearchInput.setValue(indentor.indentor_name);
    this.showIndenterDropdown = false;
    const indentor_id = indentor.indentor_id;
    this.selectedIndenterId = indentor.indentor_id;
    const indentor_name = indentor.indentor_name;
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear, indentor_id, indentor_name);
  }

  selectAllIndenterOption() {
    this.selectedIndenterName = 'All'; // ✅ update selected name
    this.indenterSearchInput.setValue('All');
    this.filteredIndenterOptions = [...this.IndentorDataList]; // reset filter to all crops
    this.indenterChartData = { ...this.allIndenterChartData }; // reset chart to all data
    this.showIndenterDropdown = false;
    this.getIndenterWiseTotalIndentsChartData(this.activeSeason, this.activeYear, null);
  }

  filterIndentorOptions(searchTerm: any) {
    if (!searchTerm) {
      this.filteredIndenterOptions = Array.isArray(this.IndentorDataList) ? [...this.IndentorDataList] : [];
      this.indenterChartData = { ...this.allIndenterChartData };
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    this.filteredIndenterOptions = this.IndentorDataList.filter(indentor =>
      indentor.indentor_name.toLowerCase().includes(lowerSearch)
    );

    const filteredIndexes = this.IndentorDataList
      .map((indentor, index) =>
        indentor.indentor_name.toLowerCase().includes(lowerSearch) ? index : -1
      )
      .filter(index => index !== -1);

    this.indenterChartData = {
      labels: filteredIndexes.map(i => this.IndentorDataList[i].indentor_name),
      datasets: this.allIndenterChartData.datasets.map(ds => ({
        ...ds,
        data: filteredIndexes.map(i => ds.data[i])
      }))
    };
  }

  getIndentorDataList(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
      }
    };

    this.breederService.postRequestCreator('get-chart-indenter-wise-indenter-list', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (
            res?.EncryptedResponse?.status_code === 200 &&
            Array.isArray(data) &&
            data.length > 0 &&
            data[0].user_id !== null &&
            data[0].indenter_name !== null
          ) {
            this.IndentorDataList = data;
          } else {
            this.IndentorDataList = [];
            this.filteredIndenterOptions = []
            console.warn('Indenter data not found or contains null values.');
          }
        },
        (err) => {
          console.error('Error fetching Indenter data:', err);
        }
      );
  }

  getIndenterChartCanvasHeight1(): number {
    const records = this.indenterChartData?.labels?.length || 0;
    const barGroupHeight = 80; // Adjust based on your barThickness + spacing
    const minHeight = 150; // Minimum height to avoid tiny canvas

    return Math.max(records * barGroupHeight, minHeight);
  }


  getIndenterChartCanvasHeightFullScreen(): number {
    const records = this.indenterChartData?.labels?.length || 0;
    const barGroupHeight = 125; // px per record group including spacing

    // Show 5 records in container width, scroll for more
    return records <= 5 ? 900 : records * barGroupHeight;
  }

  getIndenterChartCanvasHeight(): number {
    const records = this.indenterChartData?.labels?.length || 0;
    const barGroupHeight = 100; // px per record group including spacing

    // Show 5 records in container width, scroll for more
    return records <= 5 ? 300 : records * barGroupHeight;
  }



  getIndenterWiseTotalIndentsChartData(activeSeason: any, activeYear: any, indentor_id: any | null = null, indentor_name: any | null = null): void {
    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(indentor_id !== null && { indentor_id: indentor_id })

      }
    };
    const apiEndpoint = indentor_id !== null
      ? 'get-chart-indenter-to-crop-wise'
      : 'get-chart-indenter-wise';
    this.breederService.postRequestCreator(apiEndpoint, null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && Array.isArray(data)) {
            //   If data exists but first item has null variety_code and variety_name, show blank chart
            if (indentor_id !== null && data.length === 1 && data[0].crop_code === null && data[0].crop_name === null) {
              const blankChart = { labels: [], datasets: [] };
              this.indenterChartData = blankChart;
              this.allIndenterChartData = blankChart;
              this.indenterOptions = [];
              return;
            }

            // ✅ Prepare Names based on condition
            // const Names = data.map((item: any) => {
            //   const name = indentor_id ? (item.crop_name || '') : (item.indenter_name || '');
            //   return name.length > 10 ? name.substring(0, 10) + '...' : name;
            // });

            const Names = data.map((item: any) => {
              const fullName = indentor_id ? (item.crop_name || '') : (item.indenter_name || '');
              return fullName.length > 8 ? fullName.substring(0, 8) + '...' : fullName;
            });
            this.IndenterFullNames = data.map((item: any) => indentor_id ? (item.crop_name || '') : (item.indenter_name || ''));


            this.indenterSearchInput.setValue(indentor_name);
            this.indenterOptions = [...Names];
            //  Chart data update
            this.allIndenterChartData = {
              labels: Names,
              datasets: [
                {
                  data: data.map(item => item.total_indent_quantity || 0),
                  label: 'Indent Quantity',
                  backgroundColor: '#FF6384',
                  barThickness: 10 // ✅ set here
                },
                {
                  data: data.map(item => item.total_allocate_quantity || 0),
                  label: 'Allocated Quantity',
                  backgroundColor: '#8E44AD',
                  barThickness: 10 // ✅ set here
                },
                {
                  data: data.map(item => item.total_lifted_quantity || 0),
                  label: 'Lifted Quantity',
                  backgroundColor: '#4BC0C0',
                  barThickness: 10 // ✅ set here
                }
              ]
            };
            this.indenterChartData = { ...this.allIndenterChartData };
          } else {
            this.indenterChartData = { labels: [], datasets: [] };

            console.warn('Indenter-wise chart data not found');
          }
        },
        err => {
          console.error('Indenter-wise chart API Error:', err);
        }
      );
  }
  downloadIndenterPng() {
    const element = this.captureIndenterArea.nativeElement;
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'Indenter-wise-total-indents-and-lifting.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadIndenterExcel(): void {
    const indentor_id = this.selectedIndenterName === "All" ? null : this.selectedIndenterId ?? null;
    const indentor_name = this.selectedIndenterName ?? null;
    const activeSeason = this.activeSeason;
    const activeYear = this.activeYear;

    const payload = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
        ...(indentor_id !== null && { indentor_id })
      }
    };

    const apiEndpoint = indentor_id !== null
      ? 'get-chart-indenter-to-crop-wise'
      : 'get-chart-indenter-wise';

    this.breederService.postRequestCreator(apiEndpoint, null, payload)
      .subscribe((res: any) => {
        const data = res?.EncryptedResponse?.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data found to export.");
          return;
        }

        const wb = XLSX.utils.book_new();
        let ws: XLSX.WorkSheet;

        if (indentor_id === null) {
          // Indenter-wise data
          const sheetData = [
            ["Indenter wise total indents and lifting (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["Indenter"],
            ["All"],
            [],
            ["Indenter", "Indent quantity", "Allocated quantity", "Lifted quantity"],
            ...data.map((item: any) => [
              item.indenter_name || '',
              item.total_indent_quantity || 0,
              item.total_allocate_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);
        } else {
          // Crop-wise data under selected Indenter
          const indenterLabel = data[0]?.indenter_name || indentor_name;
          const sheetData = [
            ["Indenter wise total indents and lifting (Qt)"],
            [],
            ["Crop group", "Year", "Season"],
            [this.activeCropGroupName ? this.activeCropGroupName : "All", activeYear, activeSeason],
            [],
            ["Indenter"],
            [indenterLabel],
            [],
            ["Crop", "Indent quantity", "Allocated quantity", "Lifted quantity"],
            ...data.map((item: any) => [
              item.crop_name || '',
              item.total_indent_quantity || 0,
              item.total_allocate_quantity || 0,
              item.total_lifted_quantity || 0
            ])
          ];
          ws = XLSX.utils.aoa_to_sheet(sheetData);
        }

        XLSX.utils.book_append_sheet(wb, ws, "Indenter Data");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `Indenter-wise-total-indents-and-lifting-${Date.now()}.xlsx`);
      });
  }

  // =====================
  // Indenter wise total indents and lifting  Ends
  // =====================


  // =====================
  // Code for Area Sown By State Start
  // =====================


  toggleStateDropdown1(): void {
    this.showStateDropdown = !this.showStateDropdown;
  }
  selectAllStateOption1() {
    this.stateSearchInput.setValue('All');
    this.showStateDropdown = false; // close dropdown if needed
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear, null);

  }
  selectStateOption1(state: { id: any, state_name: any }) {
    this.showStateDropdown = false;
    const id = state.id;
    const state_name = state.state_name;
    this.stateSearchInput.setValue(state.state_name);
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear, id);
  }
  toggleStateDropdown() {
    this.showStateDropdown = !this.showStateDropdown;

    if (this.showStateDropdown) {
      // When dropdown opens, clear search input to show full list
      this.stateSearchInput.setValue('');
      this.filteredStateOptions = [...this.StateDataList];
    }
  }

  selectStateOption(state: { id: any, state_name: any }): void {
    this.selectedStateName = state.state_name; // ✅ Save selected name separately
    this.stateSearchInput.setValue(state.state_name);
    this.showStateDropdown = false;
    const id = state.id;
    this.selectedStateIds = state.id
    this.selectedStateNames = state.state_name
    const state_name = state.state_name;
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear, id);
  }
  selectAllStateOption() {
    this.selectedStateName = 'All';
    this.stateSearchInput.setValue('All');
    this.filteredStateOptions = Array.isArray(this.StateDataList) ? [...this.StateDataList] : [];
    this.stateChartData = { ...this.allStateChartData };
    this.showStateDropdown = false;
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear, null, null);
  }

  filterStateOptions(searchTerm: any) {
    if (!searchTerm) {
      this.filteredStateOptions = Array.isArray(this.StateDataList) ? [...this.StateDataList] : [];
      this.stateChartData = { ...this.allStateChartData };
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    this.filteredStateOptions = this.StateDataList && this.StateDataList.filter(state =>
      state.state_name.toLowerCase().includes(lowerSearch)
    );

    const filteredIndexes = this.StateDataList && this.StateDataList
      .map((state, index) =>
        state.state_name.toLowerCase().includes(lowerSearch) ? index : -1
      )
      .filter(index => index !== -1);

    this.stateChartData = {
      labels: filteredIndexes.map(i => this.StateDataList && this.StateDataList[i].state_name),
      datasets: this.allStateChartData.datasets.map(ds => ({
        ...ds,
        data: filteredIndexes.map(i => ds.data[i])
      }))
    };
  }


  onStateChange() {
    this.getAreaSownByStateChart(this.activeSeason, this.activeYear, this.selectedStateId);
  }

  getStateDataList(activeSeason: any, activeYear: any) {
    const payload = {
      search: {
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup
      }
    };

    this.service.postRequestCreator('get-state-data', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && Array.isArray(data)) {
            this.filteredStateOptions = data;
            this.StateDataList = data;
          } else {
          }
        },
        (err) => {
          console.error('Error fetching State data:', err);
        }
      );
  }

  getAreaSownByStateChart(activeSeason: any, activeYear: any, state_code: number | null = null, state_name: any | null = null) {
    const payload: any = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
      }
    };
    if (state_code !== null) {
      payload.search.state_code = state_code;
    }
    this.service.postRequestCreator('get-area-sown-by-state-chart-data', null, payload)
      .subscribe(
        (res: any) => {
          const data = res?.EncryptedResponse?.data;
          if (res?.EncryptedResponse?.status_code === 200 && Array.isArray(data)) {
            const labelKey = state_code !== null ? 'crop_name' : 'state_name';

            // const labelName = data.map((item: any) => {
            //   const name = item[labelKey] || '';
            //   return name.length > 10 ? name.substring(0, 10) + '...' : name;
            // });


            const labelName = data.map((item: any) => {
              const name = item[labelKey] || '';
              return name.length > 10 ? name.substring(0, 10) + '...' : name;
            });
            this.StateFullNames = data.map((item: any) => item[labelKey] || '');


            this.stateSearchInput.setValue(state_name);
            this.getStateDataList(activeSeason, activeYear)

            this.allStateChartData = {
              labels: labelName,
              datasets: [
                {
                  label: 'Inspected Area',
                  data: data.map((d: any) => d.inspected_area),
                  backgroundColor: '#4BC0C0',
                },
                {
                  label: 'Rejected Area',
                  data: data.map((d: any) => d.rejected_area),
                  backgroundColor: '#5A7CA4',
                },
                {
                  label: 'Pending Area',
                  data: data.map((d: any) => d.pending_area),
                  backgroundColor: '#DF3335',
                }
              ]
            };

            this.stateChartData = { ...this.allStateChartData };

          } else {
            console.warn('Area Sown Chart Data not found.');
          }
        },
        (err) => {
          console.error('Error fetching area sown chart data:', err);
        }
      );
  }

  downloadStatePng() {
    const element = this.captureStateArea.nativeElement;
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'Area-sown-by-state.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadStateExcel(): void {
    const state_code = this.selectedStateName === "All" ? null : this.selectedStateIds ?? null;
    const state_name = this.selectedStateName ?? null;
    const activeSeason = this.activeSeason;
    const activeYear = this.activeYear;

    const payload: any = {
      search: {
        graphType: this.graphType,
        crop_type: this.crop_type,
        season: activeSeason,
        year: activeYear,
        group_code: this.activeCropGroup,
      }
    };

    if (state_code !== null) {
      payload.search.state_code = state_code;
    }

    this.service.postRequestCreator('get-area-sown-by-state-chart-data', null, payload)
      .subscribe((res: any) => {
        const data = res?.EncryptedResponse?.data || [];
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data found to export.");
          return;
        }

        const wb = XLSX.utils.book_new();
        let sheetData: any[] = [];

        // COMMON HEADER
        const heading = "Area sown by state (In Hectares)";
        sheetData.push([heading], []);
        sheetData.push(["Crop group", "Year", "Season"]);
        sheetData.push([
          this.activeCropGroupName || "All",
          activeYear,
          activeSeason
        ]);
        sheetData.push([], ["State"], [state_code ? state_name : "All"], []);

        if (state_code === null) {
          // State-wise data
          sheetData.push(["State", "Inspected", "Rejected area", "Pending area"]);
          data.forEach((item: any) => {
            sheetData.push([
              item.state_name || '',
              item.inspected_area || 0,
              item.rejected_area || 0,
              item.pending_area || 0
            ]);
          });
        } else {
          // Crop-wise data within a selected state
          sheetData.push(["Crop", "Inspected", "Rejected area", "Pending area"]);
          data.forEach((item: any) => {
            sheetData.push([
              item.crop_name || '',
              item.inspected_area || 0,
              item.rejected_area || 0,
              item.pending_area || 0
            ]);
          });
        }

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, "State Area Data");

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(
          new Blob([excelBuffer], { type: 'application/octet-stream' }),
          `Area-sown-by-state-${Date.now()}.xlsx`
        );
      });
  }

  // =====================
  // Code for Area Sown By State Ends
  // =====================







}



