// Todo esto de template es solo html

<template>
 <v-container>
 
  <v-container>
    
    <h2 class="titulos">¡Encuentra tu película de interés!</h2>
    <v-divider></v-divider>
    <v-form>
      <v-container>
      <v-row>
        <v-col cols="12">
            <SearchComponent @update:movie="movieUpdate" @close:movie="closeMovie"/>
        </v-col>
      </v-row>
        <v-row>
          <v-col cols="8">
            <!-- Este es el botón que va a ejecutar la función search (linea 52) que en realidad accionará axios para traer la data del API -->
            <v-btn class="tfbusqueda"  :disabled="disabledButton" style="border-radius:120px;" @click="search" 
            >Recomendar</v-btn>
          </v-col>
        </v-row>
        <v-row v-if="displayProgressCircular" >
          <v-col cols="12">
       
                <v-progress-circular
                  
                  :size="70"
                  :width="7"
                  color="white"
                  indeterminate
                ></v-progress-circular>
         
          </v-col>
        </v-row>
        <v-row>    
          <ul class="mt">
          <v-alert type="error" color="red" v-if="isError">
            Ocurrió un error en el sistema.
          </v-alert>
          <v-alert type="success" v-if="isSuccess">
            Se encontraron películas en base al contenido de : {{this.titleMovie}}.
          </v-alert>
             <v-layout row class="mt" v-if="displayContent" >
                <v-flex>
                  <li v-for="name in names" :key="name.id">
                          <v-card
                              class="cardf"
                              max-width="344"
                            >
                              <v-img
                                src="../assets/img/movie.jpg"
                                height="150px"
                              ></v-img>

                              <v-card-title class="font-weight-medium" >
                                {{name.title}}
                              </v-card-title>

                              <v-card-subtitle>
                                <b>Género : </b> {{name.genres}}
                              </v-card-subtitle>

                            </v-card>

                  </li>
                </v-flex>
            </v-layout>

          </ul>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
  </v-container>
</template>

<script>
import axios from "axios";
import SearchComponent from '../components/search-component.vue'
import {ENDPOINT_RECOMMENDER_MOVIE_API} from '../config/config.js'

export default {
  name: "Home",
  components: {
    SearchComponent
  },

  // en esta sección se hacen las declaraciones de las variable que luego se usan arriba en la parte html(template)
  data() {
    return {
      // acá solo declaro las dos variables, el primero para el ID que usamos para el api y el segundo va a guardar lo respuesta
      titleMovie: "",
      movieID: "",
      names: [],
      sour:[],
      disabledButton:false,
      displayProgressCircular:false,
      isSuccess:false,
      isError:false,
      displayContent:false
    };
  },
  created() {
          if(this.movieID===""){
            this.disabledButton = true;
          }
    },
  watch: {
      movieID(nuevoValor){
        if (nuevoValor===""){
          this.disabledButton = true;
        }else{
          this.disabledButton = false;
        }
        
    }},
  methods: {
    closeMovie: function(value){
        if(value){ this.disabledButton = true}else{this.disabledButton=false}
    },
    movieUpdate: function(value){

      this.movieID = value.movieId;
      this.titleMovie = value.title;
    },
    // esta es la función que se acciona cuando hago click en el botón, mira la línea 16 en donde dice @click
    search() {
      this.disabledButton = true;
      this.displayContent=false;
      this.isSuccess = false;
      this.isError = false;
      this.displayProgressCircular = true;
      // acá primero convierto el id que estaba en string(línea 45) a int porque así lo pide el api
      var page = parseInt(this.movieID); //cuando nos referimos a los datos de data(), hay que usar this.

      // luego paso ese id al final del url
      axios.post(ENDPOINT_RECOMMENDER_MOVIE_API ,{
        movieId: page,
        ntop:5
      })
      .then((res) => {
        this.isSuccess = true
        this.displayContent = true;
        
        console.log(res.data);
        console.log(res.data.source);
        // acá guardo la respuesta en la variable que definí en data(), ve la línea 46
        this.names = res.data.recommerders;
        this.sour = res.data.source;
        
      }).catch((error)=>{
        console.log(error)
        this.isError = true;
      
      }).finally(() => {
        this.displayProgressCircular = false;
        this.disabledButton = false;
      });
    },
  }
}
</script>
