import { Axios } from "axios";
import {createStore} from "vuex";
import axiosClient from '../axios';

//akan ada duplicate code so we use intercepters function jugak

// const tempSurveys = [
//     {
//         id:100,
//         title: "Syahin Youtube Channel",
//         slug: "Begineer to Pro",
//         status: "draft",
//         image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
//         description: 
//         "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
//         created_at: "2021-12-20 12:00:00",
//         updated_at: "2021-12-20 12:00:00",
//         expire_date: "2021-12-31 12:00:00",
//         questions: [
//             {
//                 id:1,
//                 type: "select",
//                 question: "From which country are you?",
//                 description: null,
//                 data: {
//                     options: [
//                         {uuid: "fdgr34qw-1234-3234-23d2-avcdsf4wfrt3" , text: "USA"},
//                         {uuid: "gasd24qw-1234-3234-23d2-avcdsf4wfrt3" , text: "Georgia"},
//                         {uuid: "gdvdasda-1234-3234-23d2-avcdsf4wfrt3" , text: "Germany"},
//                         {uuid: "gdcsddas-1234-3234-23d2-avcdsf4wfrt3" , text: "Malaysia"},
//                     ]
//                 },
//             },
//             {
//                 id:2,
//                 type:"checkbox",
//                 question: "Which language",
//                 description: 
//                 "Qui officia do quis adipisicing deserunt veniam Lorem.",
//                 data: {
//                     options: [
//                         {uuid: "fdgr34qw-4567-3234-23d2-avcdsf4wfrt3" , text: "Javascript"},
//                         {uuid: "gasd24qw-4345-3234-23d2-avcdsf4wfrt3" , text: "Php"},
//                         {uuid: "gdvdasda-5553-3234-23d2-avcdsf4wfrt3" , text: "Go"},
//                         {uuid: "gdcsddas-1235-3234-23d2-avcdsf4wfrt3" , text: "HTML+CSS"},
//                     ]
//                 },
//             },
//             {
//                 id:3,
//                 type:"checkbox",
//                 question: "Which Php Framework",
//                 description: 
//                 "Qui officia do Et esse pariatur et Lorem anim do ea enim.quis adipisicing deserunt veniam Lorem.",
//                 data: {
//                     options: [
//                         {uuid: "fdgr34qw-4567-3234-4444-avcdsf4wfrt3" , text: "Laravel"},
//                         {uuid: "gasd24qw-4345-3234-sdsd-avcdsf4wfrt3" , text: "Yii2"},
//                         {uuid: "gdvdasda-5553-3234-12ds-avcdsf4wfrt3" , text: "Codeigniter"},
//                         {uuid: "gdcsddas-1235-3234-5343-avcdsf4wfrt3" , text: "Symfony"},
//                     ]
//                 },
//             },
//             {
//                 id:4,
//                 type:"radio",
//                 question: "Which Laravel  Framework",
//                 description: 
//                 "Qui officia do Et esse pariatur et Lorem anim do ea enim.quis adipisicing deserunt veniam Lorem.",
//                 data: {
//                     options: [
//                         {uuid: "fdgr34qw-4567-3234-4444-asdcsdsdcccc" , text: "Laravel 6"},
//                         {uuid: "gasd24qw-4345-3234-sdsd-cccccccccccc" , text: "Laravel 4"},
//                         {uuid: "gdvdasda-5553-3234-12ds-dsdasdasdadd" , text: "Laravel 8"},
//                         {uuid: "gdcsddas-1235-3234-5343-xcxccxcxcxcx" , text: "Laravel 7"},
//                     ]
//                 },
//             },
//             {
//                 id:5,
//                 type: "text",
//                 question: "I handsome? explain ",
//                 description: null,
//                 data: {},
//             },
//             {
//                 id:6,
//                 type: "textarea",
//                 question: "I handsome? explain ",
//                 description: "Write in essay",
//                 data: {},
//             },
//         ],
//     },
//     {
//         id:200,
//         title: "Syahin Youtube Telegram",
//         slug: "Begineer to Pro",
//         status: "active",
//         image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
//         description: 
//         "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
//         created_at: "2021-12-20 12:00:00",
//         updated_at: "2021-12-20 12:00:00",
//         expire_date: "2021-12-31 12:00:00",
//         questions: []
//     },
//     {
//         id:300,
//         title: "Syahin Youtube Fuck You",
//         slug: "Begineer to Pro",
//         status: "draft",
//         image: "https://pbs.twimg.com/profile_images/1118059535003017221/9ZwEYqj2_400x400.png",
//         description: 
//         "My name is  Syahin <br> I am Web Developer with 0 kwowledge of vue js and i will try to be a pro programmer",
//         created_at: "2021-12-20 12:00:00",
//         updated_at: "2021-12-20 12:00:00",
//         expire_date: "2021-12-31 12:00:00",
//         questions: []
//     },
// ];

const store = createStore({
    state:{
        user: {
            data:{},
            token: sessionStorage.getItem('TOKEN'),
        },
        // dashboard: {
        //     loading: false, 
        //     data: {}
        // },
        dashboard : {
            loading: false,
            data: {},
        },
        currentSurvey:{
            loading: false,
            data: {}, //will be an object  and actual content
        },
        // surveys: [...tempSurveys],
        surveys: {
            loading: false, 
            links: [],
            data: [],
        },
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
        notification: {
            show: false,
            type: null,
            message: null,
        }
    },
    getters:{},
    actions:{
        getDashboardData({commit}){
            commit('dashboardLoading', true)
            return axiosClient.get(`/dashboard`)
            .then((res) => {
                commit('dashboardLoading', false)
                commit('setDashboardData', res.data)
                return res;
            })
            .catch(error => {
                commit('dashboardLoading', false)
                return error;
            })
        },
        saveSurveyAnswer({commit}, {surveyId, answers}){
            return axiosClient.post(`/survey/${surveyId}/answer`, {answers});
        }
        ,
        getSurveys({commit}, {url= null} = {} ){
            url = url || '/survey'
            commit('setSurveysLoading',true)
            return axiosClient.get(url).then((res) => {
                commit('setSurveysLoading',false)
                commit("setSurveys",res.data);
                return res;
            });
        },
        getSurveyBySlug({commit} ,slug){
            commit("setCurrentSurveyLoading", true);
            return axiosClient.get(`/survey-by-slug/${slug}`)
            .then((res) => {
                commit("setCurrentSurvey", res.data);
                commit("setCurrentSurveyLoading", false);
                return res;
            })
            .catch((err) => {
                commit("setCurrentSurveyLoading" , false);
                throw err;
            })
        },
        deleteSurvey({}, id){
            return axiosClient.delete(`/survey/${id}`);
        },
        getSurvey({commit} , id){
            commit("setCurrentSurveyLoading" , true); //loading indicator
            return axiosClient.get(`/survey/${id}`)
            .then((res) => {
                commit("setCurrentSurvey", res.data);
                commit("setCurrentSurveyLoading",false);
                return res;
            })
            .catch((err) => {
                commit("setCurrentSurveyLoading", false);
                throw err;
            });
        },
        saveSurvey({commit}, survey){
            delete survey.image_url; // nak buang image_url dkt be
            let response;
            if(survey.id){
                response =axiosClient.put(`/survey/${survey.id}`, survey)
                    .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                    });
            }
            else{
                response = axiosClient.post("/survey", survey).then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                });
            }
            return response;
        },
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
        dashboardLoading: (state, loading) => {
            state.dashboard.loading = loading;
        },
        setDashboardData: (state,data) => {
            state.dashboard.data = data;
        },
        setSurveysLoading : (state,loading) => {
            state.surveys.loading = loading;
        },
        setCurrentSurveyLoading : (state,loading) => {
            state.currentSurvey.loading = loading;
        },
        setCurrentSurvey: (state, survey ) => {
            state.currentSurvey.data = survey.data;
        },
        setSurveys: (state, surveys ) => {
            // debugger;
            state.surveys.links = surveys.meta.links;
            state.surveys.data = surveys.data;
        },
        // saveSurvey: (state,survey) => {
        //     state.surveys = [...state.surveys, survey.data];
        // },
        // updateSurvey: (state,survey) => {
        //     state.surveys = state.surveys.map((s) => {
        //         if(s.id ==survey.data.id){
        //             return survey.data;
        //         }
        //         return s; 
        //     });
        // },
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
        setUser: (state , userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token); //session token kalau refresh still ada
        },
        notify: (state, {message,type}) => {
            state.notification.show = true; 
            state.notification.type = type;
            state.notification.message = message; 
            setTimeout(() => {
                state.notification.show = false; 
            }, 3000)
        }
    },
    modules:{}
})

export default store;