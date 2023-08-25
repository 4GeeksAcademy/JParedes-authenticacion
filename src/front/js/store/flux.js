const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			accessToken : null,
			userInfo : null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			apiFetchPublic:async (endpoint, method="GET", body=null)=>{
				var request
				// Si la peticion es GET
				if(method == "GET"){
					// Se hace un fetch sencillo 
					request = fetch(process.env.BACKEND_URL + "/api" + endpoint)
				}
				else{
					// Se crea el objeto parametros, con todo lo necesario para la peticion
					const params = {
						method,
						headers:{
							"Content-Type":"application/json"
						}
					}
					// Si hay un body, se agrea a los parametros
					if(body) params.body = JSON.stringify(body)
					// La peticion termina siendo al endpoint con los parametros que se definieron
					request = fetch(process.env.BACKEND_URL + "/api" + endpoint, params)
				}
				const resp = await request
				const data = await resp.json()
				return {code:resp.status,data}
			},

			apiFetchProtected:async (endpoint, method="GET", body=null)=>{
				// Se crea el objeto parametros, con todo lo necesario para la peticion. Incluido el token en el encabezado de autorizacion
				const { accessToken} = getStore()
				if(!accessToken){
					return "NO HAY tOKEN"
				}
				const params = {
					method,
					headers:{
						"Authorization" : "Bearer " + accessToken
					}
				}
					
				// Si hay un body, se agrea a los parametros
				if(body){
					params.headers["Content-Type"]="application/json"
					params.body = JSON.stringify(body)
				}
				// La peticion termina siendo al endpoint con los parametros que se definieron
				const resp = await fetch(process.env.BACKEND_URL + "/api" + endpoint, params)
				const data = await resp.json()
				return {code:resp.status,data}
			},


			loadTokens : ()=>{
				let token=localStorage.getItem("accessToken")
				setStore({accessToken:token})
			},

			login: async (email, password) => {
				const {apiFetchPublic} = getActions()
				const data = await apiFetchPublic("/login","POST",{email,password})
				if(resp.code !=200){
					console.error("Login error")
					return null
				}
				console.log({resp})
				const {message, token} = resp.data
				localStorage.setItem("accessToken",token)
				setStore({accessToken : token})
				return message
			},

			signup: (email, password) => {

			},

			getUserInfo:async()=>{
				const {apiFetchProtected} = getActions()
				resp = await apiFetchProtected("/private")
				setStore({userInfo:resp.data})
				return "ok"
			},

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const {apiFetchPublic} = getActions()
					const data = await apiFetchPublic("/hello")
					setStore({ message: data.data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
