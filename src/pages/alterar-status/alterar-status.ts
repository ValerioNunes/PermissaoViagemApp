import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams , Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ContatosPage } from '../contatos/contatos';
import { MensagemProvider } from '../../providers/msg/mensagem';
/**
 * Generated class for the AlterarStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alterar-status',
  templateUrl: 'alterar-status.html',
})
export class AlterarStatusPage {
  Solicitacao : any; 
  ListStatus: any;
  Status: any;
  Solicitante : any;

  NovoStatus = this.FormatStatus();

  loading: Loading;

  constructor(public navCtrl: NavController,
              public restProvider: RestProvider,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              public navParams: NavParams,
              public msg         : MensagemProvider) {

    this.Solicitacao =  this.navParams.get('Dados');
    this.ListStatus = this.navParams.get('Status');

    //this.ListStatus.splice(3, 1);
    this.NovoStatus.SolicitacaoViagemId = this.Solicitacao[0].Id;
    this.Solicitante = this.Solicitacao[0].Empregado;
  }

  onSubmit(event){
    
    this.NovoStatus.StatusId =  this.Status;
   
    this.showLoading();

    this.restProvider.setStatusSolicitacao(this.NovoStatus).then(allowed => {
      console.log(allowed);

      if(allowed == 'Sua solicitação foi cadastrada com sucesso!'){

         this.showError("Status alterado com  SUCESSO!")
         this.navCtrl.pop();

         if(this.Status == 2)
            this.EnviarMensagem(this.Solicitante,"NÃO APROVADA")
         else if(this.Status == 3){
            this.EnviarMensagem(this.Solicitante,  "APROVADA")
          }

      }else{
        this.showError("NÃO foi possível realizar alteração do Status!")
      }
     
      this.loading.dismiss();
  }).catch(error => { console.log(error) });
  }


EnviarMensagem(Empregado, Status){

  let Mensagem = { Telefone : Empregado.Telefone,
    Texto    : "Permissao Viagem - "+
               "Sua Solicitação de Viagem De: " +this.Solicitacao[0].Origem
               +" Para: " +this.Solicitacao[0].Destino +"  "+  Status
   };
  this.msg.SendSMS(Mensagem);

}




private FormatStatus(){
  return  { SolicitacaoViagemId     : '',
            StatusId                : ''}
  }
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
    content: 'Aguarde...',
    dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Atenção...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  contato(event){


    var contatos : any = []

    this.showLoading();
    this.restProvider.getContadosDaSolicitacao(this.NovoStatus.SolicitacaoViagemId).then(allowed => {
      console.log(allowed);
      contatos = allowed;
      this.loading.dismiss();
      
      this.navCtrl.push(ContatosPage,{ Contatos : contatos, Viajantes :  this.Solicitacao[0].ViajanteSolicitacaoId });
      
  }).catch(error => { console.log(error) });

  }

}
