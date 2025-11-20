import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  endpoint: string = environment.ms_nb_01_master.apiUrl;
  baseUrl: string = environment.ms_nb_01_master.baseUrl;
  apiBaseUrl: string = environment.ms_nb_01_master.apiBaseUrl;
  generateSampleData:any;
  userBasicData = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  constructor(private http: HttpClient) { }

  getPlansInfo(FromPath: string, token: any = '', DataRow: any={}){
    console.log(token);
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const authToken = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + authToken);
     return new Promise((resolve, reject) => {
         this.http.post(this.endpoint  + FromPath , token, { headers: otherHeader } ).pipe(
           map((res:any) => res))
           .subscribe((res:any) => {
             resolve(res);
           }, (err:any) => {
             reject(err);
           });
     });
   }
   
  getRequestCreatorNew(route: string): Observable<{}> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint + route, { headers: otherHeader });

    // return this.http.get<{}>(this.endpoint + route);

  }

  postRequestCreator<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    DataRow.validation_token = token
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
  postRequestCreatorV2<T>(route: string, DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    // token = currentUser? currentUser.token:'';
    // DataRow.validation_token = token
    const header = new HttpHeaders();
    // const otherHeader = header.append('Authorization', 'Bearer ' );
    return this.http.post<T>(this.endpoint + route, DataRow);
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }

  loginRequest<T>(route: string, token: any = '', DataRow: any = {}): Observable<any> {

    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
}
