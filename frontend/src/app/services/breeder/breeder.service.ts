import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BreederService {
  endpoint: string = environment.ms_nb_03_breeder.apiUrl;
  baseUrl: string = environment.ms_nb_03_breeder.baseUrl;
  apiBaseUrl: string = environment.ms_nb_03_breeder.apiBaseUrl;
  bspcData:any;
  redirectData:any;
  constructor(private http: HttpClient) {
    console.log("bspcData service",this.bspcData);
   }

  getRequestCreatorNew(route: string): Observable<{}> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    const token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.get<{}>(this.endpoint + route, { headers: otherHeader });
  }
  postRequestCreator<T>(route: string, token: any = ''||null, DataRow: any = {}): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);
    return this.http.post<T>(this.endpoint + route, DataRow, { headers: otherHeader });
    // return this.http.post<T>(this.endpoint + route, DataRow);
  }
  getPlansInfo(FromPath: string, DataRow: any={}, token: any = ''){
    // console.log(token);
    const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
    token = currentUser? currentUser.token:'';
    const header = new HttpHeaders();
    const otherHeader = header.append('Authorization', 'Bearer ' + token);

     return new Promise((resolve, reject) => {
         this.http.post(this.endpoint  + FromPath ,DataRow,  { headers: otherHeader } ).pipe(
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

  getMaximumLotSizeForEachCropReport(): Observable<any> {
  const currentUser = JSON.parse(localStorage.getItem('BHTCurrentUser'));
  const token = currentUser ? currentUser.token : '';
  const header = new HttpHeaders();
  const otherHeader = header.append('Authorization', 'Bearer ' + token);

  return this.http.get<any>(this.endpoint + 'maximumLotSizeReport', { headers: otherHeader });
}

}
