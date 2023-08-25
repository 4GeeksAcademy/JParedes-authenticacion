import React, { useState, useEffect, useContext } from "react";
import { Link , useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);
	const [userData, setUserData] = useState(null)
	const navigate = useNavigate()

	useEffect(()=>{
	   if(store.accessToken){
	   actions.getUserInfo().then(data=>setUserData(data))
	   }else{
		navigate("/")
	   }
	},[store.accessToken])

	return (
		<div className="container">
			<p>{userData=="ok"? JSON.stringify(store.userInfo):userData}</p>
			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};
