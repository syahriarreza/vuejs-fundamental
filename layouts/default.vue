<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndUp"
        @click.stop="miniVariant = !miniVariant"
      />
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content>
      <div :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp, 'mx-3': $vuetify.breakpoint.smAndDown }">
        <nuxt />
      </div>
    </v-content>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Awesome Video Text Finder',
      clipped: true,
      drawer: true, //show or hide drawer as a whole
      miniVariant: this.$vuetify.breakpoint.mdAndUp, //true: will not show drawer's title, show drawer's icon only instead
      fixed: false,
      items: [
        {
          icon: 'mdi-movie-search-outline',
          title: 'Video Text Finder',
          to: '/',
        },
      ],
    }
  },
}
</script>
