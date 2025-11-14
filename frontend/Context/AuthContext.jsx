import { children, createContext,useState } from "react";

export const AuthContext=createContext(null);

export function AuthProvider({children}){
    const[user,setUser]=useState("default");
    const login=(user)=>setUser(user);
    const logout=()=>setUser(null);
    return(
        <AuthContext.Provider value={{user,login}}>
            {children}
        </AuthContext.Provider>
    )
}