import sub163 from './search/sub163';

let sub163Service = new sub163();

const Search = {
    sub163: sub163Service,
    default: sub163Service
}

export default Search;