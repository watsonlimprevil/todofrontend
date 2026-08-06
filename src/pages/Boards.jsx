import { useEffect, useState } from 'react';
import { api } from '../Api/client';
import { useNavigate } from 'react-router-dom';

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description , setDescription] = useState('')
  const Navigate = useNavigate()
  useEffect(() => {
    api('/boards/').then(setBoards);
  }, []);

  async function handleCreateBoard() {
    const newBoard = await api('/boards', {
      method: 'POST',
      body: JSON.stringify({ title , description })
    });

    setBoards([...boards, newBoard]);
    setShowModal(false);
    setTitle('');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Boards</h1>

      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 20px',
          background: '#4caf50',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + New Board
      </button>

      {showModal && (
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
            <h2>Create Board</h2>

            <input
              type="text"
              placeholder="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />
            <input
               type="text"
               placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
             />


            <button
              onClick={handleCreateBoard}
              style={{
                marginTop: '15px',
                padding: '10px',
                width: '100%',
                background: '#4caf50',
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => Navigate(`/boards/${board.id}`)}
            style={{
              background: '#1e1e1e',
              padding: '20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {board.title}

          </div>
        ))}
      </div>
    </div>
  );
}
