import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { HomePage } from '../home/home';
import {MinhasSolicitacoesPage} from '../minhas-solicitacoes/minhas-solicitacoes'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MinhasSolicitacoesPage;

  constructor(public navParams: NavParams) {}



}
