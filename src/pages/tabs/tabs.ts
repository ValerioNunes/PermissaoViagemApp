import { Component } from '@angular/core';
import {  NavParams} from 'ionic-angular';
import { HomePage } from '../home/home';
import { MinhasSolicitacoesPage } from '../minhas-solicitacoes/minhas-solicitacoes'
import { SolicitarviagemPage } from'../solicitarviagem/solicitarviagem';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;  
  tab2Root = SolicitarviagemPage;
  tab3Root = MinhasSolicitacoesPage;


  constructor(public navParams: NavParams) {}



}
