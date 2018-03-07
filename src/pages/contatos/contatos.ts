import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MensagemProvider } from '../../providers/msg/mensagem'
/**
 * Generated class for the ContatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contatos',
  templateUrl: 'contatos.html',
})
export class ContatosPage {

  Contatos: any;
  Viajantes: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public msg: MensagemProvider) {

    this.Contatos = this.navParams.get('Contatos');
    this.Viajantes = this.navParams.get('Viajantes');
    console.log(this.Contatos);
    console.log(this.Viajantes);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContatosPage');
  }
  LigarParaViajante(viajante) {

    if (viajante.Empregado.Telefone != null) {

      this.LigarParaTelefone(viajante.Empregado.Telefone);

    } else {
      this.showError(viajante.Empregado.Nome + " Não possui número cadastrado");
    }

  }

  LigarParaTelefone(Telefone) {
    if (Telefone != null) {
      this.msg.LigarPara(Telefone);
    }
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Atenção...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}