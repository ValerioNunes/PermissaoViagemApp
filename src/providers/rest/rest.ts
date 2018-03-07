import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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

  apiUrl = 'http://192.168.13.18/solicitacaoviagem/api';
  placeUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=BuscaID&key=AIzaSyA_BxomwSlI5BuebULTjOtNvnXJv7qHILY';
  constructor(public http: HttpClient ) {
    console.log('Hello RestProvider Provider');

  }
  getStatus() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/status').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getEmpregado(matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/empregadoes/' + matricula).subscribe(data => {
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
      this.http.get(this.apiUrl + '/DadosParaSolicitacaoViagemAPI').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getDadosSolicitarViagem(Matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/DadosSolicitarViagemAPI/' + Matricula.matricula).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  getMinhasSolicitacoes(Matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/MinhasSolicitacoes/' + Matricula).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
        resolve(false);
      });
    });
  }

  getPlace(id) {
    let link = this.placeUrl.replace('BuscaID',id);

    return new Promise(response => {
      this.http.get(link,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).subscribe(data => {
          response(data);
        }, err => {
          console.log(err);
          response(false);
        });
    });
  }

  getSolicitacao(Matricula) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/DadosParaSolicitacaoViagemAPI/' + Matricula,
        {
          headers: new HttpHeaders().set('Accept', 'application/json')
        }).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  getContadosDaSolicitacao(SV) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/Contatoes/' + SV,
        {
          headers: new HttpHeaders().set('Accept', 'application/json')
        }).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
          resolve(false);
        });
    });
  }

  addDadosParaSolicitacao(data) {

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/DadosParaSolicitacaoViagemAPI',
        JSON.stringify(data), {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  setStatusSolicitacao(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/AlterarStatusSolicitacaoViagem',
        JSON.stringify(data), {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  setEmpregado(data) {

    return new Promise((resolve, reject) => {
      this.http.put((this.apiUrl + '/Empregadoes/' + data.Id),
        JSON.stringify(data), {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
