import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,  Loading,LoadingController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AlterarStatusPage } from '../alterar-status/alterar-status';
import { DadosEmpregadoPage } from '../dados-empregado/dados-empregado';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage   {


  loading: Loading;
  MinhasSolicitacoes : any;
  Solicitacao : any; 


  private Solicitante :  any;
  private Aprovador   :  any;
  private Status      :  any;

  constructor( public nav: NavController ,
               public restProvider: RestProvider,
               public navParams: NavParams,
               public alertCtrl: AlertController,
               private loadingCtrl: LoadingController) {

              this.Solicitante =  this.navParams.get("Solicitante");
              this.Aprovador   =  this.navParams.get("Aprovador"); 
              this.Status      =  this.navParams.get("Status");
  }

  verificarTelefone(Empregado){
        if(Empregado.Telefone == null){
          this.nav.push(DadosEmpregadoPage,this.navParams);
        }  
  }


  ionViewWillEnter() {
    console.log(this.Solicitante.Telefone);
    this.verificarTelefone(this.Solicitante);
    this.getMinhasSolicitacoes();
  }


getMinhasSolicitacoes() {
  this.showLoading();
  this.restProvider.getMinhasSolicitacoes(this.Solicitante.Id)
  .then(data => {
    this.MinhasSolicitacoes = data;
    this.loading.dismiss();
  });
}
  
 showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Atenção...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

   showLoading() {

    this.loading = this.loadingCtrl.create({
    content: 'Aguarde! Consultando Solicitações...',
    dismissOnPageChange: true
    });
    this.loading.present();
  }

  buscarSolicitacaoAlterarStatus(Id, status){ 
    this.showLoading();
    this.restProvider.getSolicitacao(Id)
    .then(data => {
      this.loading.dismiss();
      this.nav.push(AlterarStatusPage,{Dados : data, Status : status });
    
    });
  }

  tipoUser(item){
    return (item.Aprovador == this.Solicitante.Nome)
  }

  userAprovador(item){

    if(item.Status == 'aguardando'){
      this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[1],this.Status[2]]);
    } else {
      this.buscarSolicitacaoAlterarStatus(item.Id, []);
    }
  }

  userSolicitante(item){
       //this.msg.SendSMS();

        if (item.Status == "aprovado" || item.Status == "nao_aprovado" ){
          this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
        }else if (item.Status == "encerrado") {
          this.buscarSolicitacaoAlterarStatus(item.Id, []);
        }else{

        }
  }

  itemSelected(item){
    
    if(this.tipoUser(item)){
     
      
      this.userAprovador(item)

    }else{

      this.userSolicitante(item)

    }
  }
}

