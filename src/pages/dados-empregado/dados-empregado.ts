import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { MensagemProvider } from '../../providers/msg/mensagem';
/**
 * Generated class for the DadosEmpregadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-dados-empregado',
  templateUrl: 'dados-empregado.html',
})

export class DadosEmpregadoPage {

  Telefone = this.FormatTelefone();
  TelefoneConfirmacao = this.FormatTelefone();
  loading: Loading;
  Solicitante: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public restProvider: RestProvider,
    public nav: NavController,
    private loadingCtrl: LoadingController,
    public msg         : MensagemProvider) {
    
    this.Solicitante = this.navParams.get("Solicitante");
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DadosEmpregadoPage');
  }

  onSalvar() {

    if (this.TelefoneConfirmacao.DDD === this.Telefone.DDD && this.Telefone.DDD.length === 2) {
      if (this.TelefoneConfirmacao.Numero === this.Telefone.Numero && this.Telefone.Numero.length === 9) {
        console.log(this.Telefone);

        this.setEmpregado(this.Solicitante);
   
      } else {
        this.showError("Verifique seu Número");
      }
    } else {
      this.showError("Verifique seu DDD");
    }
  }

  setEmpregado(Empregado) {

    this.showLoading();
    Empregado.Telefone =  this.Telefone.DDD+this.Telefone.Numero;
  
    console.log(Empregado);
    this.restProvider.setEmpregado(Empregado).then(allowed => {
      console.log(allowed);
      this.showError("Cadastrado com SUCESSO");

      let Mensagem = { Telefone : Empregado.Telefone,
                       Texto    : "Permissao Viagem - Número Atualizado com Sucesso" 
                      };
      this.msg.SendSMS(Mensagem);

    }).catch(error => { console.log(error); });

    this.loading.dismiss();
  }


  FormatTelefone() {
    return {
      DDD: '',
      Numero: ''
    };
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

}