import { useState , useEffect , useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../Api/client";
export default function Login(){
    const nav = useNavigate()
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('');

async function handleSubmit(){
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
        method : 'POST',
        credentials :'include',
        body : JSON.stringify({email , password}),
        headers:{'Content-Type' : 'application/json'}
    });
    const data = await res.json();
    if(data.token){
        localStorage.setItem('token', data.token);
        nav('/boards')
    }
}

    return(
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input 
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            />

            <input 
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    )
}