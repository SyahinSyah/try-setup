import {createStore} from "vuex";
import axiosClient from '../axios';

//akan ada duplicate code so we use intercepters function jugak


const store = createStore({
    state:{
        user: {
            data:{},
            token: sessionStorage.getItem('TOKEN'),
        },
    },
    getters:{},
    actions:{
        register({ commit },user) { 
            return axiosClient.post('/register', user)
            .then(({data}) =>{
                commit('setUser',data);
                 return data;
            })
        },
        login({ commit },user) { 
           return axiosClient.post('/login', user)
           .then(({data}) =>{
               commit('setUser',data);
                return data;
           })
        },
        logout({commit}) {
            return axiosClient.post('/logout')
            .then(response => {
                commit('logout')
                return response;
            })
        }
    },
    mutations:{
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
        setUser: (state , userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token); //session token kalau refresh still ada
        }
    },
    modules:{}
})

export default store;