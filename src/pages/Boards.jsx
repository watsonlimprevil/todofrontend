import { useEffect , useState } from "react";
import { api } from "../Api/client";

export default function Boards(){
    const [boards , setBoards] = useState([]);

    useEffect(() => {
        api('/boards').then(setBoards);
    },[])

    return(
        <div>
            <h1>Your Boards</h1>
            {boards.map(board => (
                <div key={board.id}>{board.title}</div>
            ))}
        </div>
    )
}