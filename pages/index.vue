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
                @keyup.enter="search"
              ></v-text-field>
              <v-text-field
                v-model="keyword"
                :rules="rules.required"
                label="Keyword"
                placeholder="Please fill this field"
                outlined
                required
                @keyup.enter="search"
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
            <span v-if="errMessage != ''" class="text-h6 red--text text--accent-3">{{ errMessage }}</span>
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
          :no-data-text="noDataText"
          class="elevation-3"
        >
          <template v-slot:item.text="{ item }">
            <span v-html="item.text"></span>
          </template>
          <template v-slot:item.link="{ item }">
            <v-btn
              fab
              dark
              x-small
              color="primary"
              @click="openYoutubePlayer(item.start)"
              :href="`${youtubeURL}&t=${item.start}`"
              target="_blank"
            >
              <v-icon dark>mdi-play</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="showPlayer" :overlay-opacity="0.9" @click:outside="stopVideo" width="unset">
      <v-card>
        <v-card-text>
          <youtube ref="youtube" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getIdFromUrl } from 'vue-youtube'

export default {
  data() {
    return {
      youtubeURL: 'https://www.youtube.com/watch?v=klnvttPfOUM',
      keyword: 'web',
      formIsValid: true,
      isFetching: false,
      showPlayer: false,
      rules: {
        required: [(v) => !!v || 'This field is required'],
      },
      errMessage: '',

      // Data Table
      headers: [
        { text: 'Result', value: 'text' },
        { text: 'Start (second)', value: 'start' },
        { text: 'End (second)', value: 'end' },
        { text: 'Youtube', value: 'link' },
      ],
      options: {},
      searchData: [],
      totalData: 0,
      noDataText: `No Data Available`,

      // Youtube Player
      videoID: 'klnvttPfOUM',
      playerOptions: {
        autoplay: 1,
        start: 50,
      },
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

      this.$store.dispatch('search/fetchSearchResult', params).then((err) => {
        if (err && err.isError) {
          this.noDataText = err.message
          this.errMessage = err.message
        } else {
          this.noDataText = `No Data Available`
          this.errMessage = ''
        }

        this.searchData = this.searchResult.data
        this.totalData = this.searchResult.total
        this.isFetching = false
      })
    },
    openYoutubePlayer(start) {
      return // Causing Error playback if using in Production

      this.videoID = getIdFromUrl(this.youtubeURL)
      this.playerOptions.start = start
      this.showPlayer = true

      let _this = this
      setTimeout(() => {
        // use delay to make sure the player is on ready state
        let ytPlayer = _this.$refs.youtube.player
        ytPlayer.loadVideoById({
          videoId: _this.videoID,
          startSeconds: _this.playerOptions.start,
        })
      }, 200)
    },
    stopVideo() {
      return // Causing Error playback if using in Production
      this.$refs.youtube.player.stopVideo()
    },
  },
}
</script>
