import axios from 'axios';
import $ from 'jquery'
let base = '';

/*export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };*/
export const requestLogin = params => { return $.post(`${base}/momingtang/backUser/login`, params)};//登录
export const requestLogout = params => { return $.post(`${base}/momingtang/backUser/logout`, params)};//退出
export const getUserListPage = params => { return $.post(`${base}/user/listpage`, params )};