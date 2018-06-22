import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation,GeolocationOptions,Geoposition,PositionError} from '@ionic-native/geolocation'


declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options:GeolocationOptions;
  currPos:Geoposition;

  @ViewChild('map') mapElement:ElementRef;
  map:any;
  places:Array<any>;

  constructor(public navCtrl: NavController,private geolocation:Geolocation) {

  }

  ionViewDidEnter(){
    this.getUserPosition();
  }

  getUserPosition(){
    this.options={
      enableHighAccuracy:true
    }

    this.geolocation.getCurrentPosition(this.options).then((pos:Geoposition)=>{
      this.currPos = pos;
      console.log(pos);
      this.addMap(pos.coords.latitude,pos.coords.longitude)
    },(err:PositionError)=>{
      console.log("err :"+err+"err msg :"+err.message);
    })
  }

  //Craete Map
  addMap(lat,long){
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center:latLng,
      zoom:15,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions)
    console.log(latLng)
    this.getRestaurants(latLng).then((result:Array<any>)=>{
      this.places=result;
      console.log(this.places)
      for(let i = 0 ;i < result.length ; i++)
        {
            this.createMarker(result[i]);
        }
    },(status)=>{
      console.log(status)
    })
    this.addMarker();

  }


  addMarker(){
    let marker = new google.maps.Marker({
      map:this.map,
      animation:google.maps.Animation.DROP,
      position:this.map.getCenter()
    })
  }

  createMarker(place){
    let marker = new google.maps.Marker({
      map:this.map,
      animation:google.maps.Animation.DROP,
      position:place.geometry.location
    })
  }

  getRestaurants(latLng){
    var service = new google.maps.places.PlacesService(this.map);

    let request = {
      location:latLng,
      radius:8074,
      types:['restaurant']
    };

    return new Promise((resolve,reject)=>{
      service.nearbySearch(request,function(results,status){
        if(status === google.maps.places.PlacesServiceStatus.OK)
        {
            resolve(results);    
        }else
        {
            reject(status);
        }

      }); 
    })
  }

}
