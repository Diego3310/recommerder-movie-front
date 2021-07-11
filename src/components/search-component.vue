<template>
    <v-card
      class="search-component"
      dark
    >
      <v-card-text>
        <v-autocomplete
          v-on:change="optionChanged"
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          item-text="title"
          item-value="movieId"
          label="Busca tu película"
          placeholder="Empieza tu búsqueda"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-list
          v-if="model"
          class="search-list"
        >
          <v-list-item 
            v-for="(field, i) in fields"
            :key="i"
          >
            <v-list-item-content>
              <div v-if="field.key === 'movieId'">
                <v-list-item-title v-text="field.value"></v-list-item-title>
                <v-list-item-subtitle>Código</v-list-item-subtitle>
              </div>
              <div v-if="field.key === 'title'">
                <v-list-item-title v-text="field.value"></v-list-item-title>
                <v-list-item-subtitle>Título</v-list-item-subtitle>
              </div>
              <div v-if="field.key === 'genres'">
                <v-list-item-title v-text="field.value"></v-list-item-title>
                <v-list-item-subtitle>Género</v-list-item-subtitle>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expand-transition>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn

          :disabled="!model"
          color="grey darken-3"
          @click="closeModel"
        >
          Clear
          <v-icon right>
            mdi-close-circle
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>

<script>
  import {ENDPOINT_PATH_MOVIES_API} from '../config/config.js'  
 
  export default {
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null
    }),
    methods:{

        optionChanged: function(value){
          this.$emit('update:movie',value);
          this.$emit('close:movie',false)
        },
        closeModel: function(){
            this.model = null;
            this.$emit('close:movie',true)
        }

    },
    computed: {
      fields () {
        
        if (!this.model) return []
       
        return Object.keys(this.model).map(key => {
          return {
            key,
            value: this.model[key] || 'n/a',
          }
        })
      },
      items () {
        return this.entries.map(entry => {
        console.log(entry)
          const Description = entry.title.length > this.descriptionLimit
            ? entry.title.slice(0, this.descriptionLimit) + '...'
            : entry.title
           return Object.assign({}, entry, { Description })
        })
      },
    },

    watch: {
      search () {

        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        fetch(ENDPOINT_PATH_MOVIES_API)
          .then(res => res.json())
          .then(res => {
            console.log(res)
            this.entries = res
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))

      },
    },
  }
</script>