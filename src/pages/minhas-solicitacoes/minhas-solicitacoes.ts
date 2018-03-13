import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Loading , LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DadosEmpregadoPage } from '../dados-empregado/dados-empregado';



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

  MinhasSolicitacoes: any = []; 
  Solicitante: any;
  loading: Loading;

  constructor(public nav : NavController,
              public navParams: NavParams,
              public restProvider: RestProvider,
              private loadingCtrl: LoadingController) {
              this.Solicitante =  this.navParams.get("Solicitante");
              
  }

  ionViewWillEnter() {

  }

  getMinhasSolicitacoes() {
    this.showLoading();
    this.restProvider.getMinhasSolicitacoes(this.Solicitante.Id)
    .then(data => {
            this.MinhasSolicitacoes = data;
            this.loading.dismiss();
    });
  }

  itemSelected(item){

  }
  
  showLoading() {
        this.loading = this.loadingCtrl.create({
        content: 'Aguarde! Consultando Solicitações...',
        dismissOnPageChange: true
        });
        this.loading.present();
  }

  alterarTelefone(event){
    this.nav.push(DadosEmpregadoPage,this.navParams);
  }
}
