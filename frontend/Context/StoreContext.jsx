import { useEffect } from "react";
import { createContext } from "react";
import axios from 'axios';


export const StoreContext = createContext();


const StoreContextProvider = (props) => {

    const getAllProducts = async() =>{
        try {
            const response = await axios.get("http://localhost:4000/");
            console.log(response);
        } catch (error) {
            console.log(error.message);
            
        }
    }

    useEffect(()=>{
        getAllProducts();
    },[])

    const value = {};
    return (
        <StoreContext.Provider value={value}> {props.children} </StoreContext.Provider>
    )
}

export default StoreContextProvider
