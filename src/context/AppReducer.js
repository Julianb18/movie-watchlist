// eslint-disable-next-line
export default (state, action) => {
  switch (action.type) {
    case "HYDRATE_COLLECTIONS":
      return {
        ...state,
        watchlist: action.payload.watchlist,
        watched: action.payload.watched,
      };

    case "ADD_MOVIE_TO_WATCHLIST":
      return {
        ...state,
        watchlist: [action.payload, ...state.watchlist.filter((item) => item.media_key !== action.payload.media_key)],
        watched: state.watched.filter((item) => item.media_key !== action.payload.media_key),
      };

    case "REMOVE_MOVIE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.media_key !== action.payload),
      };

    case "ADD_MOVIE_TO_WATCHED":
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.media_key !== action.payload.media_key),
        watched: [action.payload, ...state.watched.filter((item) => item.media_key !== action.payload.media_key)],
      };

    case "MOVE_TO_WATCHLIST":
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.media_key !== action.payload.media_key),
        watchlist: [action.payload, ...state.watchlist.filter((item) => item.media_key !== action.payload.media_key)],
      };

    case "REMOVE_FROM_WATCHED":
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.media_key !== action.payload),
      };

    default:
      return state;
  }
};
