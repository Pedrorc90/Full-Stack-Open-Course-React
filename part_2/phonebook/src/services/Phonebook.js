import axios from 'axios'
//const baseUrl = 'https://vast-tor-73969.herokuapp.com/api/persons'
const baseUrl = '/api/persons'


const getAll = () => axios.get(baseUrl).then(response => response.data)

const getById = ( id ) => axios.get(`${baseUrl}/${id}`).then(response => response.data)

const getByName = ( name ) => axios.get(`${baseUrl}`, { params: { name } }).then(response => response.data)

const create = ( newObject ) => axios.post(baseUrl, newObject).then(response => response.data)

const update = ( id, newObject ) => axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)

const remove = ( id ) => axios.delete(`${baseUrl}/${id}`).then(response => response.data)


export default { getAll, create, update, remove, getById, getByName }