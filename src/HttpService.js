import axios from 'axios';

const HttpService = axios.create({
				baseURL: 'https://cloud.mail.ru',
});

// HttpService.defaults.headers.common['X-RapidAPI-Key'] = 'bcaf95ea8bmshf1b1e083680d4c9p19da93jsnc3a1e26f89d5'
// HttpService.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default HttpService