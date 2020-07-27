export const state = () => ({
  searchResult: {},
})

export const mutations = {
  SET_SEARCH_RESULT(state, searchResult) {
    state.searchResult = searchResult
  },
}

export const actions = {
  fetchSearchResult({ commit }, { url, q, page, size }) {
    let marked = 1
    let paginated = 1
    url = encodeURIComponent(url)
    return this.$axios
      .post(`/api/search?url=${url}&q=${q}&page=${page}&size=${size}&marked=${marked}&paginated=${paginated}`)
      .then(res => {
        if (res.data && res.data.data) {
          // Sort by start
          res.data.data.sort((a, b) => {
            if (a.start < b.start) return -1
            if (a.start > b.start) return 1
            return 0
          })
        } else {
          commit('SET_SEARCH_RESULT', { data: [], total: 0 })
          return {
            isError: true,
            message: res.data.message || 'Error: could not fetch from API',
          }
        }

        commit('SET_SEARCH_RESULT', res.data)
      })
  },
}