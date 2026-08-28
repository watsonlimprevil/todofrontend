import { useState , useEffect , useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login(){
    const nav = useNavigate()
    const {login} = useContext(AuthContext);
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('');


 async function handleSubmit(){
    const res = await api('/auth/login',{
        method : 'POST',
        body:JSON.stringify({email ,password})
    });
    if(res.token){
        localStorage.setItem('token', res.token )
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