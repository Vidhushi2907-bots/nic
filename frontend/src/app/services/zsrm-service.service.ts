import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorValidate } from '../_helpers/utility';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class ZsrmServiceService {
  endpoint: string = environment.ms_nb_07_zsrm.apiUrl;
  baseUrl: string = environment.ms_nb_07_zsrm.baseUrl;
  apiBaseUrl: string = environment.ms_nb_07_zsrm.apiBaseUrl;
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
  getDataById(route: string,id: number): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
     const header = new HttpHeaders();
     const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint+route+id,  { headers: otherHeader });
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
   getRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<T>(this.endpoint + route, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
  
  deleteRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser?currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.delete<T>(this.endpoint + route, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
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
putRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  token = currentUser? currentUser.token:'';
  const header = new HttpHeaders();
  const otherHeader = header.append('Authorization', 'Bearer ' + token);
  return this.http.put<T>(this.endpoint + route, DataRow, { headers: otherHeader });
  // return this.http.post<T>(this.endpoint + route, DataRow);
}
}


export interface APIRunResultType {
  status: number,
  message: string,
  result?: any
}