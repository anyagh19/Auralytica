import {Navigate} from 'react-router-dom'
import api from '../api'
import { ACCESS_TOKEN , REFRESH_TOKEN } from '../constants'
import { useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

function ProtectedRoutes ({children}) {
    const[isAuthorized , setISAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setISAuthorized(false))
    } , [])

    const refreshToken = async () => {
        const token = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/" , {refresh: token})
            if(res.status == 200){
                localStorage.setItem(ACCESS_TOKEN , res.data.access )
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                setISAuthorized(true)
            }
            else{
                setISAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setISAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setISAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now){
            await refreshToken()
        }
        else{
            setISAuthorized(true)
        }

    }

    if(isAuthorized == null){
        return <div>....LOading</div>
    }

    return isAuthorized ? children : <Navigate to='/login' />
}

export default ProtectedRoutes