import {createContext, useEffect, useState} from "react"
import Cookies from "js-cookie"
import {jwtDecode} from "jwt-decode"

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)

    const auth = Cookies.get('jwToken') || null;

    useEffect(() => {
        if (auth) {
            const decoded = jwtDecode(auth);
            console.log("decoded:")
            console.log(decoded)
            setUser({
                name: decoded.usuario.nombre,
                id: decoded.usuario._id,
                username: decoded.usuario.email
            })
        }
    }, [])

    const logoutUser = () => {
        setUser(null);
        Cookies.remove('jwToken')
    }

    return (
        <AuthContext.Provider value={{user, setUser, auth, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )

}