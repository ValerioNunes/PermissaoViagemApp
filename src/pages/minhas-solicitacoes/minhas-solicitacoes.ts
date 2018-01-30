import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';



/**
 * Generated class for the MinhasSolicitacoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minhas-solicitacoes',
  templateUrl: 'minhas-solicitacoes.html',
})
export class MinhasSolicitacoesPage {
  transportes: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    this.getTransportes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinhasSolicitacoesPage');
  }


  getTransportes() {
    this.restProvider.getTransportes()
    .then(data => {
      this.transportes = data;
      console.log(this.transportes);
    });
  }
}
