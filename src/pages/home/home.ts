
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AlterarStatusPage } from '../alterar-status/alterar-status';
import { DadosEmpregadoPage } from '../dados-empregado/dados-empregado';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  directionsDisplay: any;

  loading: Loading;
  MinhasSolicitacoes:any = [];
 
  TodasSolicitacoes:any = [];
  Solicitacao: any;
  numViajando: any;
  Relatorio = [];

  private Solicitante: any;
  private Aprovador: any;
  private Status: any;

  //status =  ['viajando','nao_aprovado','aprovado','espera','expirado','cancelado','desvio_viagem','analisar_desvio'] 
  //StatusPrinc = ["aguardando","viajando","aprovado","nao_aprovado",'cancelado','desvio_viagem','analisar_desvio']
  StatusPrinc = ['encerrado','expirado'];
  constructor(public nav: NavController,
              public restProvider: RestProvider,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

    this.Solicitante = this.navParams.get("Solicitante");
    this.Aprovador = this.navParams.get("Aprovador");
    this.Status = this.navParams.get("Status");
  
  }
  ionViewWillEnter() {
    this.verificarTelefone(this.Solicitante);
    this.getMinhasSolicitacoes();
   }
  ionViewDidLoad() {
   //this.loadMap();
   }

  loadMap(){
    
      var latLng = new google.maps.LatLng(-2.53073, -44.3068);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }

  resumoStatus(){
    var Relatorio =  this.TodasSolicitacoes.map(x =>  x.Status).reduce(function (allNames, name) { 
      if (name in allNames) {
        allNames[name]++;
      }
      else {
        allNames[name] = 1;
      }
      return allNames;
    }, {});
    Relatorio =  Object.keys(Relatorio).reduce(function(out, key) {
      out.push({
        Status: key,
        Quantidade: Relatorio[key]
      });
      return out;
    }, []);
   
    this.Relatorio = Relatorio;
    this.loadMap();
   }
  
  gerarTrafego(Status){
    var Solicitacao = this.TodasSolicitacoes.filter(s => s.Status === Status.Status);
    this.setMinhasSolicitacoes(Solicitacao);
    this.loadMap();
    this.MinhasSolicitacoes.forEach(element => {
      
        if(element.Status == Status.Status){
          var request = {
            origin:      {'placeId': element.IdOrigemPlace },//new google.maps.LatLng(this.Origem.lat, this.Origem.lng),
            destination: {'placeId': element.IdDestinoPlace},//new google.maps.LatLng(this.Destino.lat, this.Destino.lng),
            travelMode: google.maps.TravelMode.DRIVING,
          }
       
            this.directionsDisplay = new google.maps.DirectionsRenderer({
              suppressMarkers: false,
              suppressInfoWindows: false
            });
    
          var directionsService = new google.maps.DirectionsService;
          this.directionsDisplay.setMap(this.map);


          let lvDirectionsDisplay = this.directionsDisplay;
          directionsService.route(request,  function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              lvDirectionsDisplay.setDirections(result);
              var dados = {
                  DISTANCIA: lvDirectionsDisplay.directions.routes[0].legs[0].distance.text,
                  DURACAO:   lvDirectionsDisplay.directions.routes[0].legs[0].duration.text
              }
            }
          });
        }
     });
  
   }

  clearMap(){

    if(this.directionsDisplay != null) {
      
      this.directionsDisplay.setMap(null);
      this.directionsDisplay = null;
      }
    }

  getMinhasSolicitacoes() {
    this.showLoading();
    this.restProvider.getMinhasSolicitacoes(this.Solicitante.Id)
      .then(data => { 
        this.loading.dismiss();
        
        this.TodasSolicitacoes = data;

        var Solicitacao = this.TodasSolicitacoes.filter(s => this.StatusPrinc.findIndex(x => x === s.Status ) < 0);
        this.setMinhasSolicitacoes(Solicitacao);
        
        this.resumoStatus();
      });
   }
  setMinhasSolicitacoes(TodasSolicitacoes){
    this.MinhasSolicitacoes = TodasSolicitacoes;
   }
  verificarTelefone(Empregado) {
      if (Empregado.Telefone == null) {
        this.nav.push(DadosEmpregadoPage, this.navParams);
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

  showLoading() {

    this.loading = this.loadingCtrl.create({
      content: 'Aguarde! Consultando Solicitações...',
      dismissOnPageChange: false
    });
    this.loading.present();
   }

  buscarSolicitacaoAlterarStatus(Id, status) {
    this.showLoading();
    this.restProvider.getSolicitacao(Id)
      .then(data => {
        this.loading.dismiss();
        this.nav.push(AlterarStatusPage, { Dados: data, Status: status, User :  this.Solicitante });
      });
   }
 
  tipoUser(item) {
    return (item.Aprovador == this.Solicitante.Nome)
   }

  userAprovador(item) {
    switch(item.Status) { 
      
      case "aguardando": {   
        this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[1], this.Status[2]]);
        break; 
      }       
      case "cancelado": {   
        this.buscarSolicitacaoAlterarStatus(item.Id,[this.Status[3]]);
        break; 
      } 
      case "analisar_desvio": {   
        this.buscarSolicitacaoAlterarStatus(item.Id,[this.Status[3]]);
        break; 
      }  
   
      default:{
        this.buscarSolicitacaoAlterarStatus(item.Id, []);
       break; 
      }
    }

    }
  userSolicitante(item) {

        switch(item.Status) { 
      
          case "nao_aprovado": {   
              this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[3]]);
            break; 
          }       
          case "aprovado": { 
              this.buscarSolicitacaoAlterarStatus(item.Id, [this.Status[4],this.Status[6]]); 
            break; 
          } 
          case "viajando": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,   [this.Status[3]]); 
          break; 
          }
          case "desvio_viagem": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,[this.Status[8]]); 
          break;    
          }
          case "encerrado": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,[]); 
          break; 
          }
          case "expirado": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,[]); 
          break; 
          }
          case "aguardando": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,[]); 
          break; 
          }
          case "cancelado": { 
            this.buscarSolicitacaoAlterarStatus(item.Id,[]); 
          break;
          }
          default:{
            this.buscarSolicitacaoAlterarStatus(item.Id, []);
           break; 
          }
    }
  }

  itemSelected(item) {

    if (this.tipoUser(item)) {

      this.userAprovador(item)

    } else {

      this.userSolicitante(item)

    }
    }

}
