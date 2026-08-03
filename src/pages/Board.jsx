import { useParams } from "react-router-dom";
import { useState , useEffect } from "react";
import { api } from "../Api/client";
export default function Board(){
    const {id} = useParams();
    const [lists , setLists] = useState([])

    useEffect(()=>{
        api(`/boards/${id}/lists`).then(setLists)
    },[id])

    return(
        <div style={{padding : '20px'}}>
            <h1>Board #{id}</h1>
            <div style={{
                display :'flex',
                gap: '20px',
                marginTop: '20px'
            }}>
                {lists.map(list => (
                    <div
                    key={list.id}
                    style={{
                        background: '#1e1e1e',
                        padding:'20px',
                        borderRadius:'8px',
                        width:'250px'
                    }}
                    >
                        <h3>{list.title}</h3>

                    </div>
                ))}
            </div>
        </div>
    )
}