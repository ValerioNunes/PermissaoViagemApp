import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class RestProvider {
  currentUser: any;

  apiUrl = 'http://localhost:49425/api';
  
  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');

  }
  getStatus() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/status').subscribe(data => {
        resolve(data);        
      }, err => {
        console.log(err);
      });
    });
  }

 public  getEmpregado(matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/empregadoes/'+matricula).subscribe(data => {
        console.log(data); 
        resolve([true, data]);   
      }, err => {
        console.log(err);
        resolve([false, err]);
      });
    });
  }


  getTransportes() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/transportes').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
public getDadosSolicitarViagem(Matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/DadosSolicitarViagemAPI/'+ Matricula.matricula).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl+'/users', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  public  solicitanteUser(): any{
      return this.currentUser;
  }
  
}
