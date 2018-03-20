import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapsPage } from '../pages/maps/maps';
import { MinhasSolicitacoesPage } from '../pages/minhas-solicitacoes/minhas-solicitacoes'
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { SolicitarviagemPage } from '../pages/solicitarviagem/solicitarviagem';
import { AlterarStatusPage } from '../pages/alterar-status/alterar-status';
import { DadosEmpregadoPage } from '../pages/dados-empregado/dados-empregado';
import { ContatosPage } from '../pages/contatos/contatos';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { HttpClientModule } from '@angular/common/http';
import { RestProvider } from '../providers/rest/rest';
import { MensagemProvider } from '../providers/msg/mensagem';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MinhasSolicitacoesPage,
    LoginPage,
    TabsPage,
    SolicitarviagemPage,
    AlterarStatusPage,
    DadosEmpregadoPage,
    ContatosPage,
    MapsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrMaskerModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MinhasSolicitacoesPage,
    LoginPage,
    SolicitarviagemPage,
    AlterarStatusPage,
    TabsPage,
    DadosEmpregadoPage,
    ContatosPage,
    MapsPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RestProvider,
    SMS,
    MensagemProvider,
    CallNumber
  ]
})
export class AppModule { }
