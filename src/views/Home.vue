<template>
 <v-container>
 
  <v-container>
    
    <h2 class="titulos">¡Encuentra tu película de interés!</h2>
    <v-divider></v-divider>
    <v-form>
      <v-container>
      <v-row>
        <v-col cols="12">
            <SearchComponent @update:movie="movieUpdate" @update:number="numberUpdate"  @close:movie="closeMovie"/>
        </v-col>
      </v-row>
        <v-row>
          <v-col cols="8">
             <v-btn class="tfbusqueda" :disabled="disabledButton" style="border-radius:120px;" @click="search" 
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
import {ENDPOINT_RECOMMENDER_MOVIE_API,DEFAULT_MOVIE_TOP} from '../config/config.js'

export default {
  name: "Home",
  components: {
    SearchComponent
  },

  data() {
    return {
      titleMovie: "",
      movieID: "",
      names: [],
      sour:[],
      nTop:DEFAULT_MOVIE_TOP,
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
    numberUpdate: function(value){
      this.nTop = value;
    },
    search() {
      this.disabledButton = true;
      this.displayContent=false;
      this.isSuccess = false;
      this.isError = false;
      this.displayProgressCircular = true;
     
      let page = parseInt(this.movieID); 

      axios.post(ENDPOINT_RECOMMENDER_MOVIE_API ,{
        movieId: page,
        ntop: parseInt(this.nTop)
      })
      .then((res) => {
        this.isSuccess = true
        this.displayContent = true;

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
