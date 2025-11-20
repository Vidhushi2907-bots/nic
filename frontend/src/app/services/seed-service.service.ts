import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
;
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { errorValidate } from '../_helpers/utility';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SeedServiceService {
  endpoint: string = environment.ms_nb_05_seed_division_center.apiUrl;
  baseUrl: string = environment.ms_nb_05_seed_division_center.baseUrl;
  apiBaseUrl: string = environment.ms_nb_05_seed_division_center.apiBaseUrl;
  bsp3rdReportData = [];
  bsp3rdReportData2 = [];
  constructor(private http: HttpClient, private ngxService: NgxUiLoaderService) { console.log("list sevice data===>>>",this.bsp3rdReportData);}

  getRequestCreatorNew(route: string): Observable<{}> {
    // return this.http.get<{}>(this.endpoint + route);
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
   const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint + route,  { headers: otherHeader });
  }

 
  getPlansInfo(FromPath: string, token: any = '', DataRow: any={}){
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
     token = currentUser? currentUser.token:'';
     console.log("Tokensssssssssssssssssssss22222222222",token);
     const header = new HttpHeaders();
     const otherHeader = header.append('Authorization', 'Bearer ' + token);
     return new Promise((resolve, reject) => {
         this.http.post(this.endpoint  + FromPath , DataRow,  { headers: otherHeader } ).pipe(
           map((res:any) => res))
           .subscribe((res:any) => {
             resolve(res);
           }, (err:any) => {
             reject(err);
           });
     });
   }
  
// getCropDataByGroupCode(groupCode: string): Observable<any> {
//   const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
//   const token = currentUser ? currentUser.token : '';
//   const header = new HttpHeaders();
//   const otherHeader = header.append('Authorization', 'Bearer ' + token);

  
//   return this.http.post<any>(
//     this.endpoint + 'getCropDataByGroupCode',
//     { cropGroupCode: groupCode },
//     { headers: otherHeader }
//   );
// }


// getCropDataByGroupCode(groupCode: string): Observable<any> {
//   const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
//   const token = currentUser ? currentUser.token : '';
//   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

//   return this.http.post<any>(
//     this.endpoint + 'getCropDataByGroupCode',
//     { group_code: groupCode }, 
//     { headers: headers }
//   );
// }

//  getCropDataByGroupCode(groupCode: string): Observable<any> {
//     const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser') || '{}');
//     const token = currentUser ? currentUser.token : '';
//     const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

//     return this.http.post<any>(
//       this.endpoint + 'getCropDataByGroupCode',
//       { group_code: groupCode },
//       { headers }
//     );
//   }
getCropDataByGroupCode(groupCode: string = 'ALL'): Observable<any> {
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser') || '{}');
  const token = currentUser?.token || '';
  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

  return this.http.post<any>(
    this.endpoint + 'getCropDataByGroupCode',
    { group_code: groupCode },  // 'ALL' bhejne par backend sab rows return karega
    { headers }
  );
}


  getRequestCreator<T>(FromPath: string, token: any='', DataRow: any={},): Observable<any> {
    const header = new HttpHeaders();

    // const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<T>(this.endpoint + FromPath ,  DataRow ).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }
 
  postRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
handleError(error: HttpErrorResponse): any {
  errorValidate(error);
}
upload(file, token: any = ''):Observable<any> {
  // Create form data
  const formData = new FormData(); 
  formData.append("file", file, file.name);
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  token = currentUser? currentUser.token:'';
  const header = new HttpHeaders();
  const otherHeader = header.append('Authorization', 'Bearer ' + token);
  return this.http.post(this.endpoint + 'utils/upload', formData, { headers: otherHeader });
}
download(fileName, token: any = ''):Observable<any> {
  // Create form data
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  token = currentUser? currentUser.token:'';
  const header = new HttpHeaders();
  const otherHeader = header.append('Authorization', 'Bearer ' + token);
  return this.http.get(this.endpoint + 'utils/file-download?file='+ fileName, { headers: otherHeader });
}
}


export interface APIRunResultType {
  status: number,
  message: string,
  result?: any
}

