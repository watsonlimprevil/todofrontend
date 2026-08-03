
import { useEffect, useState } from 'react';
import { api } from '../Api/client';

export default function Boards() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    api('/boards').then(setBoards);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Boards</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {boards.map(board => (
          <div
            key={board.id}
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
