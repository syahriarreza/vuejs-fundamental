<template>
  <div>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 6 : 12">
        <v-card class="mb-2">
          <v-card-text class="pb-0">
            <v-form ref="searchForm" v-model="formIsValid" lazy-validation>
              <v-text-field
                v-model="youtubeURL"
                :rules="rules.required"
                label="Youtube URL"
                placeholder="Please fill this field"
                outlined
                required
              ></v-text-field>
              <v-text-field
                v-model="keyword"
                :rules="rules.required"
                label="Keyword"
                placeholder="Please fill this field"
                outlined
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              :loading="isFetching"
              :disabled="isFetching || !formIsValid"
              color="primary"
              class="ma-2 white--text"
              @click="search"
            >
              <v-icon left dark>mdi-cloud-search</v-icon>Search
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 6 : 12">
        <v-data-table
          :headers="headers"
          :items="searchData"
          :options.sync="options"
          :server-items-length="totalData"
          :loading="isFetching"
          :items-per-page="10"
          :disable-sort="true"
          class="elevation-1"
        >
          <template v-slot:item.text="{ item }">
            <span v-html="item.text"></span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formIsValid: true,
      isFetching: false,
      rules: {
        required: [(v) => !!v || 'This field is required'],
      },
      headers: [
        { text: 'Result', value: 'text' },
        { text: 'Start (second)', value: 'start' },
        { text: 'End (second)', value: 'end' },
        { text: 'Youtube', value: 'link' },
      ],
      options: {},
      searchData: [],
      totalData: 0,

      // API Params
      youtubeURL: 'https://www.youtube.com/watch?v=klnvttPfOUM&t=3327',
      keyword: 'web',
    }
  },
  computed: {
    searchResult() {
      return this.$store.state.search.searchResult
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
  },
  methods: {
    search() {
      if (!this.$refs.searchForm.validate()) {
        return
      }
      this.getDataFromApi()
    },
    getDataFromApi() {
      this.searchData = []
      this.totalData = 0
      this.isFetching = true
      const { page, itemsPerPage } = this.options

      let params = {
        url: this.youtubeURL,
        q: this.keyword,
        page: page,
        size: itemsPerPage,
      }

      this.$store.dispatch('search/fetchSearchResult', params).then(() => {
        this.searchData = this.searchResult.data
        this.totalData = this.searchResult.total
        this.isFetching = false
      })
    },
  },
}
</script>
