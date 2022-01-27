import {createStore} from "vuex";


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
            return fetch(`http://localhost:8000/api/register`,{
                headers: {
                    "Content-Type" : "application/json",
                    Accept: "application/json",
                },
                method : "POST",
                body : JSON.stringify(user),
            })
            .then((res) => res.json())
            .then((res) => {
                commit("setUser", res);
                return res;
            });
        },
    },
    mutations:{
        logout: state => {
            state.user.data = {};
            state.user.token = null;
        },
        setUser: (state , userData) => {
            state.user.token = userData.token;
            state.user.data = userData.data;
            sessionStorage.setItem('TOKEN', userData.token); //session token kalau refresh still ada
        }
    },
    modules:{}
})

export default store;