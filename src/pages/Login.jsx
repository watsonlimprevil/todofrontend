import { useState , useEffect , useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login(){
    const {login} = useContext(AuthContext);
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email , password);
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