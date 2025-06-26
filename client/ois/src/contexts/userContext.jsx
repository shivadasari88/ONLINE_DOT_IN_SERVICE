import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext()

export const UserContextProvider  = (props)=>{


    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)


    const getAuthState = async ()=> {
        try {
            const{data} = await axios.get('/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get('/profile')
            data.success? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();

    },[])

const value ={

    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData

}

    return(
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}