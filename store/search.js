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
        commit('SET_SEARCH_RESULT', res.data)
      })
  },
}