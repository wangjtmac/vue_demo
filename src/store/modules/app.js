const app = {
    states : ()=>({
        globalState: null
    }),
    mutations: {
        SET_GLOBAL_STATE: (state, payload) => {
            state.globalState = payload.state;
        }
    },
    actions: {
        setGlobalState : ({commit} ,state)=>{
            commit({
                type : 'SET_GLOBAL_STATE' ,
                state
            })
        }
    },
};

export default app;
