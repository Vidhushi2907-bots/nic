



import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
;
import { Router } from '@angular/router';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { errorValidate } from '../../_helpers/utility';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SeedRollingPlanningService {
  endpoint: string = environment.ms_nb_008_srp.apiUrl;
  baseUrl: string = environment.ms_nb_008_srp.baseUrl;
  apiBaseUrl: string = environment.ms_nb_008_srp.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getRequestCreatorNew(route: string): Observable<{}> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint + route, { headers: otherHeader });
  }


  postRequestCreator<T>(route: string, token: any = '',DataRow: any = {},): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
   
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
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
}
