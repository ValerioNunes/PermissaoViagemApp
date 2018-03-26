import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;

  registerCredentials = { matricula: '' };
  constructor(private nav: NavController, private alertCtrl: AlertController, public restProvider: RestProvider, private loadingCtrl: LoadingController) { }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
    this.showLoading()
    this.restProvider.getDadosSolicitarViagem(this.registerCredentials).then(allowed => {
      if (allowed !== false) {
       
        this.nav.setRoot(TabsPage, allowed); 

      } else {
        this.showError("Matricula Inválida!")
      }
    }).catch(error => { console.log(error) });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde! Verificando Matricula...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Ops...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
    this.loading.dismiss();
  }
}