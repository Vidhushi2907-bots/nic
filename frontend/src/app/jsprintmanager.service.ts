import { Injectable } from '@angular/core';
import { LabelData } from './label-data.model';  // Import the model if needed

declare var JSPM: any; // Declare JSPM to use it in the service

@Injectable({
  providedIn: 'root'
})
export class JsPrintManagerService {

  constructor() { }

  start() {
    // JSPM.JSPrintManager.auto_reconnect = true;
    // JSPM.JSPrintManager.start();
    // JSPM.JSPrintManager.silentMode = true; // Enable silent mode to avoid confirmation dialogs

    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.silentMode = true;  // Ensures silent mode is enabled
    JSPM.JSPrintManager.setPrintDialogEnabled(false); // Disable print dialog
  }

  checkWebSocketStatus(): boolean {
    
    if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
      return true;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
      alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
      return false;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
      alert('JSPM has blocked this website!');
      return false;
    }
    return false;
  }

  // generateCommands(labelData: LabelData): string {
  //   let cmds = "^XA";
  //   cmds += "^MMT";
  //   cmds += "^PW575";
  //   cmds += "^LL1119";
  //   cmds += "^LS0";

  //   // Label content using dynamic data
  //   cmds += `^FT50,780^A0B,25,24^FH\\^FD${labelData.companyName}^FS`;
  //   cmds += `^FT80,630^A0B,25,24^FH\\^FD${labelData.location}^FS`;
  //   cmds += `^FT110,680^A0B,25,24^FH\\^FDClass of Seed: ${labelData.seedClass}^FS`;
  //   cmds += `^FO70,100^BQN,2,4^FH\\^FDLA,${labelData.qrCodeUrl}^FS`;
  //   cmds += `^FT190,850^A0B,25,24^FH\\^FDCrop: ${labelData.crop}^FS`;
  //   cmds += `^FT190,450^A0B,25,24^FH\\^FDDate of Test: ${labelData.testDate}^FS`;
  //   cmds += `^FT240,850^A0B,25,24^FH\\^FDVariety: ${labelData.variety}^FS`;
  //   cmds += `^FT230,450^A0B,25,24^FH\\^FDPure Seed(%): ${labelData.pureSeedPercentage}^FS`;
  //   cmds += `^FT270,850^A0B,25,24^FH\\^FDParental Line: ${labelData.parentalLine}^FS`;
  //   cmds += `^FT300,450^A0B,25,24^FH\\^FDInert Seed(%): ${labelData.inertSeedPercentage}^FS`;
  //   cmds += `^FT330,450^A0B,25,24^FH\\^FDGermination(%): ${labelData.germinationPercentage}^FS`;
  //   cmds += `^FT300,850^A0B,25,24^FH\\^FDLot No.: ${labelData.lotNumber}^FS`;
  //   cmds += `^FT270,450^A0B,25,24^FH\\^FDTag No.: ${labelData.tagNumber}^FS`;
  //   cmds += `^FT330,850^A0B,25,24^FH\\^FDBag Weight (Kg): ${labelData.bagWeight}^FS`;
  //   cmds += `^FT370,250^A0B,25,24^FH\\^FD${labelData.executiveDirector}^FS`;
  //   cmds += `^FT400,250^A0B,25,24^FH\\^FD${labelData.directorName}^FS`;
  //   cmds += `^FT420,850^A0B,25,24^FH\\^FD${labelData.footer}^FS`;

  //   // End of the job
  //   cmds += "^PQ1,0,1,Y";
  //   cmds += "^XZ";

  //   return cmds;
  // }

  // printLabel(labelData: LabelData): void {
  //   if (this.checkWebSocketStatus()) {
  //     const cpj = new JSPM.ClientPrintJob();
  //     cpj.clientPrinter = new JSPM.DefaultPrinter();

  //     const cmds = this.generateCommands(labelData); // Generate commands dynamically
  //     cpj.printerCommands = cmds;
  //     cpj.sendToClient();

      
  //   }
  // }

    generateCommands(labelData: LabelData): string {
      let cmds = "^XA";
      cmds += "^MMT";
      cmds += "^PW575";
      cmds += "^LL1119";
      cmds += "^LS0";

      // Label content using dynamic data
      cmds += `^FT50,780^A0B,25,24^FH\\^FD${labelData.companyName}^FS`;
      cmds += `^FT80,630^A0B,25,24^FH\\^FD${labelData.location}^FS`;
      cmds += `^FT110,680^A0B,25,24^FH\\^FDClass of Seed: ${labelData.seedClass}^FS`;
      cmds += `^FO70,100^BQN,2,4^FH\\^FDLA,${labelData.qrCodeUrl}^FS`;
      cmds += `^FT190,850^A0B,25,24^FH\\^FDCrop: ${labelData.crop}^FS`;
      cmds += `^FT230,450^A0B,25,24^FH\\^FDDate of Test: ${labelData.testDate}^FS`;
      cmds += `^FT240,850^A0B,25,24^FH\\^FDVariety: ${labelData.variety}^FS`;
      cmds += `^FT190,450^A0B,25,24^FH\\^FDPure Seed(%): ${labelData.pureSeedPercentage}^FS`;
      cmds += `^FT270,850^A0B,25,24^FH\\^FDParental Line: ${labelData.parentalLine}^FS`;
      cmds += `^FT300,450^A0B,25,24^FH\\^FDInert Seed(%): ${labelData.inertSeedPercentage}^FS`;
      cmds += `^FT330,450^A0B,25,24^FH\\^FDGermination(%): ${labelData.germinationPercentage}^FS`;
      cmds += `^FT300,850^A0B,25,24^FH\\^FDLot No.: ${labelData.lotNumber}^FS`;
      cmds += `^FT270,450^A0B,25,24^FH\\^FDTag No.: ${labelData.tagNumber}^FS`;
      cmds += `^FT330,850^A0B,25,24^FH\\^FDBag Weight (Kg): ${labelData.bagWeight}^FS`;
      cmds += `^FT370,250^A0B,25,24^FH\\^FD${labelData.executiveDirector}^FS`;
      cmds += `^FT400,250^A0B,25,24^FH\\^FD${labelData.directorName}^FS`;
      cmds += `^FT420,850^A0B,25,24^FH\\^FD${labelData.footer}^FS`;
      
      // FT190,450^A0B,25,24^FH\\^FD testdate
      // FT230,450^A0B,25,24^FH\\^FD pureseed
      // End of the job
      cmds += "^PQ1,0,1,Y";  // This makes sure that only one print job is processed
      cmds += "^XZ";         // End of the label printing job

      return cmds;
  }

  printLabels(labelDataList: LabelData[]): void {
    console.log('labelDataList===1',labelDataList)
      if (this.checkWebSocketStatus()) {
          const cpj = new JSPM.ClientPrintJob();
          cpj.clientPrinter = new JSPM.DefaultPrinter();

          let allCommands = '';

          // Loop through each label data and generate commands for each label
          labelDataList.forEach((labelData, index) => {
              let cmds = this.generateCommands(labelData);
              allCommands += cmds;  // Append commands for each label
          });

          cpj.printerCommands = allCommands;  // Combine all labels into one print job
          cpj.sendToClient();  // Send the combined print job to the printer
      }
  }

}
