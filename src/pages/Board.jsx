import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../Api/client';

export default function Board() {
  const { id } = useParams();
  const [lists, setLists] = useState([]);

  const [showListModal, setShowListModal] = useState(false);
  const [listTitle, setListTitle] = useState('');

  useEffect(() => {
    api(`/boards/${id}/lists`).then(setLists);
  }, [id]);

  async function handleCreateList() {
    const newList = await api(`/boards/${id}/lists`, {
      method: 'POST',
      body: { title: listTitle }
    });

    setLists([...lists, newList]);
    setShowListModal(false);
    setListTitle('');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Board #{id}</h1>

      <button
        onClick={() => setShowListModal(true)}
        style={{
          padding: '10px 20px',
          background: '#2196f3',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + New List
      </button>

      {showListModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: '#1e1e1e',
              padding: '20px',
              borderRadius: '8px',
              width: '300px'
            }}
          >
            <h2>Create List</h2>

            <input
              type="text"
              placeholder="List title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />

            <button
              onClick={handleCreateList}
              style={{
                marginTop: '15px',
                padding: '10px',
                width: '100%',
                background: '#2196f3',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        {lists.map((list) => (
          <div
            key={list.id}
            style={{
              background: '#1e1e1e',
              padding: '20px',
              borderRadius: '8px',
              width: '250px'
            }}
          >
            <h3>{list.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
