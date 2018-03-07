import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, AlertController, Loading, NavController, NavParams,Content } from 'ionic-angular';
import { SolicitarviagemPage } from '../solicitarviagem/solicitarviagem';
/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;


@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})

export class MapsPage {
  @ViewChild(Content) content: Content;
  @ViewChild('map')     mapElement: ElementRef;

  map: any;
  loading: Loading;

  autocompleteOrigem: any;
  autocompleteDestino: any;
  markers = [];
  addressOrigem: any;
  addressDestino: any;
  directionsDisplay: any;


  Origem = {
    lat: null,
    lng: null
    }
  Destino = {
    lat: null,
    lng: null
    }
  Places = {
    origem : '',
    destino: '',
    idorigemplace: '',
    iddestinoplace: ''
    }

    constructor(public navCtrl: NavController,
              public alertCtrl: AlertController, 
              public navParams: NavParams) { 
              }
              
  ionViewWillEnter() {
    //this.clearSearchbar()
  }

  ionViewDidLoad() {
    this.loadMap();
  
    let inputOrigem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
    this.autocompleteOrigem = new google.maps.places.Autocomplete(inputOrigem);

    google.maps.event.addListener(this.autocompleteOrigem, 'place_changed', () => {
      let place = this.autocompleteOrigem.getPlace();
      console.log(place.place_id);
      this.Places.origem = place.name;
      this.Places.idorigemplace = place.place_id;

      this.Origem.lat = place.geometry.location.lat();
      this.Origem.lng = place.geometry.location.lng();
      this.iconMap(place)
      if(this.Places.iddestinoplace != '')
          this.gerarTrajeto();
    });

    let inputDestino = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[1];
    this.autocompleteDestino = new google.maps.places.Autocomplete(inputDestino);

    google.maps.event.addListener(this.autocompleteDestino, 'place_changed', () => {
      let place = this.autocompleteDestino.getPlace();
      console.log(place.place_id);
      this.Places.destino = place.name;
      this.Places.iddestinoplace = place.place_id;
      this.Destino.lat = place.geometry.location.lat();
      this.Destino.lng = place.geometry.location.lng();
      this.iconMap(place)
      if(this.Places.idorigemplace != '')
        this.gerarTrajeto();
    });
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

  gerarTrajeto(){

        this.clearMap();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService;

        this.directionsDisplay.setMap(this.map);

        var request = {
          origin: new google.maps.LatLng(this.Origem.lat, this.Origem.lng),
          destination: new google.maps.LatLng(this.Destino.lat, this.Destino.lng),
          travelMode: google.maps.TravelMode.DRIVING
        }
        let lvDirectionsDisplay = this.directionsDisplay;
        directionsService.route(request,  function (result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            lvDirectionsDisplay.setDirections(result);
            var dados = {
                DISTANCIA: lvDirectionsDisplay.directions.routes[0].legs[0].distance.text,
                DURACAO:   lvDirectionsDisplay.directions.routes[0].legs[0].duration.text
            }
            document.getElementById('distancia').innerHTML = "Distância: "+dados.DISTANCIA;
            document.getElementById('duracao').innerHTML   = "Duração:   "+dados.DURACAO;
          }
        }); 
        this.content.scrollToTop();
    }
  clearMap(){
    if(this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);
      this.directionsDisplay = null;
      }
      document.getElementById('distancia').innerHTML = "Distância: ";
      document.getElementById('duracao').innerHTML   = "Duração:   ";
    }
  clearSearchbar(){
        this.clearMap()
        this.addressOrigem  = '';
        this.addressDestino = '';
    }
  iconMap(place){

    if (place.length == 0) {
      return;
    }
    this.markers = [];
    // Clear out the old markers.
    this.markers.forEach(function (marker) {
      marker.setMap(null);
    });
   

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds(); 

    //places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      this.markers.push(new google.maps.Marker({
        map: this.map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    //});
    this.map.fitBounds(bounds);
    }

  nextSolicitacao(){

    if(this.Places.origem != ''){
      if(this.Places.destino != ''){

        let Aprovador   =  this.navParams.get("Aprovador");  
        let Transporte  =  this.navParams.get("Transporte");
        let Solicitante =  this.navParams.get("Solicitante");

        this.navCtrl.push(SolicitarviagemPage ,{ Aprovador : Aprovador , Transporte: Transporte, Solicitante: Solicitante, Places : this.Places }); 
        //this.clearSearchbar()
      }else{
        this.showError("Destino da Viagem inválido");
      }
    }else{
        this.showError("Origem da Viagem inválido");
    }

    }

  showError(text){
    let alert = this.alertCtrl.create({
      title: 'Atenção...',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  
    }

  onChangeOrigem(){ 
    this.Places.origem  = '';
    }
  onChangeDestino(){
    this.Places.destino = '';
    }



  
  
  }
