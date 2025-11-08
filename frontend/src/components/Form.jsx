import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN , REFRESH_TOKEN } from '../constants'

function Form({ route, method }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()

    let name = method == "login" ? "login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const res = await api.post(route , {username , password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <form onSubmit={handleSubmit} className='form-container flex flex-col gap-5 items-center  py-6 px-4  shadow-xl'>
                <h1 className='font-bold text-2xl'>{name}</h1>

                <input
                    className="form-input px-8 py-3 bg-white rounded-2xl shadow-xl"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    className="form-input px-8 py-3 bg-white rounded-2xl shadow-xl"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {/* {loading && <LoadingIndicator />} */}
                <button className="form-button px-4 py-2 bg-red-200 rounded-full text-md font-medium" type="submit">
                    {name}
                </button>
            </form>
        </div>
    )
}

export default Form