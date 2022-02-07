import {createStore} from "vuex";
import axiosClient from '../axios';

//akan ada duplicate code so we use intercepters function jugak

const tempSurveys = [
    {
        id:100,
        title: "Syahin Youtube Channel",
        slug: "Begineer to Pro",
        status: "draft",
        image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
        description: 
        "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
        created_at: "2021-12-20 12:00:00",
        updated_at: "2021-12-20 12:00:00",
        expire_date: "2021-12-31 12:00:00",
        questions: [
            {
                id:1,
                type: "select",
                question: "From which country are you?",
                description: null,
                data: {
                    options: [
                        {uuid: "fdgr34qw-1234-3234-23d2-avcdsf4wfrt3" , text: "USA"},
                        {uuid: "gasd24qw-1234-3234-23d2-avcdsf4wfrt3" , text: "Georgia"},
                        {uuid: "gdvdasda-1234-3234-23d2-avcdsf4wfrt3" , text: "Germany"},
                        {uuid: "gdcsddas-1234-3234-23d2-avcdsf4wfrt3" , text: "Malaysia"},
                    ]
                },
            },
            {
                id:2,
                type:"checkbox",
                question: "Which language",
                description: 
                "Qui officia do quis adipisicing deserunt veniam Lorem.",
                data: {
                    options: [
                        {uuid: "fdgr34qw-4567-3234-23d2-avcdsf4wfrt3" , text: "Javascript"},
                        {uuid: "gasd24qw-4345-3234-23d2-avcdsf4wfrt3" , text: "Php"},
                        {uuid: "gdvdasda-5553-3234-23d2-avcdsf4wfrt3" , text: "Go"},
                        {uuid: "gdcsddas-1235-3234-23d2-avcdsf4wfrt3" , text: "HTML+CSS"},
                    ]
                },
            },
            {
                id:3,
                type:"checkbox",
                question: "Which Php Framework",
                description: 
                "Qui officia do Et esse pariatur et Lorem anim do ea enim.quis adipisicing deserunt veniam Lorem.",
                data: {
                    options: [
                        {uuid: "fdgr34qw-4567-3234-4444-avcdsf4wfrt3" , text: "Laravel"},
                        {uuid: "gasd24qw-4345-3234-sdsd-avcdsf4wfrt3" , text: "Yii2"},
                        {uuid: "gdvdasda-5553-3234-12ds-avcdsf4wfrt3" , text: "Codeigniter"},
                        {uuid: "gdcsddas-1235-3234-5343-avcdsf4wfrt3" , text: "Symfony"},
                    ]
                },
            },
            {
                id:4,
                type:"radio",
                question: "Which Laravel  Framework",
                description: 
                "Qui officia do Et esse pariatur et Lorem anim do ea enim.quis adipisicing deserunt veniam Lorem.",
                data: {
                    options: [
                        {uuid: "fdgr34qw-4567-3234-4444-asdcsdsdcccc" , text: "Laravel 6"},
                        {uuid: "gasd24qw-4345-3234-sdsd-cccccccccccc" , text: "Laravel 4"},
                        {uuid: "gdvdasda-5553-3234-12ds-dsdasdasdadd" , text: "Laravel 8"},
                        {uuid: "gdcsddas-1235-3234-5343-xcxccxcxcxcx" , text: "Laravel 7"},
                    ]
                },
            },
            {
                id:5,
                type: "text",
                question: "I handsome? explain ",
                description: null,
                data: {},
            },
            {
                id:6,
                type: "textarea",
                question: "I handsome? explain ",
                description: "Write in essay",
                data: {},
            },
        ],
    },
    {
        id:200,
        title: "Syahin Youtube Telegram",
        slug: "Begineer to Pro",
        status: "active",
        image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
        description: 
        "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
        created_at: "2021-12-20 12:00:00",
        updated_at: "2021-12-20 12:00:00",
        expire_date: "2021-12-31 12:00:00",
        questions: []
    },
    {
        id:300,
        title: "Syahin Youtube Fuck You",
        slug: "Begineer to Pro",
        status: "draft",
        image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
        description: 
        "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
        created_at: "2021-12-20 12:00:00",
        updated_at: "2021-12-20 12:00:00",
        expire_date: "2021-12-31 12:00:00",
        questions: []
    },
];

const store = createStore({
    state:{
        user: {
            data:{},
            token: sessionStorage.getItem('TOKEN'),
        },
        surveys: [...tempSurveys],
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