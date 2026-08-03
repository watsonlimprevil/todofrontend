import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../Api/client';

export default function Board() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);

  // Create List modal state
  const [showListModal, setShowListModal] = useState(false);
  const [listTitle, setListTitle] = useState('');

  // Create Task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [activeListId, setActiveListId] = useState(null);

  useEffect(() => {
    api(`/boards/${id}/lists`).then(setLists);
  }, [id]);

  // Create List
  async function handleCreateList() {
    const newList = await api(`/boards/${id}/lists`, {
      method: 'POST',
      body: { title: listTitle }
    });

    setLists([...lists, newList]);
    setShowListModal(false);
    setListTitle('');
  }

  // Open Task modal
  function openTaskModal(listId) {
    setActiveListId(listId);
    setShowTaskModal(true);
  }

  // Create Task
  async function handleCreateTask() {
    const newTask = await api(`/lists/${activeListId}/tasks`, {
      method: 'POST',
      body: { title: taskTitle }
    });

    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, tasks: [...(list.tasks || []), newTask] }
        : list
    );

    setLists(updatedLists);
    setShowTaskModal(false);
    setTaskTitle('');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Board #{id}</h1>

      {/* Create List Button */}
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

      {/* Create List Modal */}
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

      {/* Create Task Modal */}
      {showTaskModal && (
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
            <h2>Create Task</h2>

            <input
              type="text"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />

            <button
              onClick={handleCreateTask}
              style={{
                marginTop: '15px',
                padding: '10px',
                width: '100%',
                background: '#673ab7',
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

      {/* Lists + Tasks */}
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

            {/* Tasks */}
            {list.tasks?.map((task) => (
              <div
                key={task.id}
                style={{
                  background: '#2e2e2e',
                  padding: '10px',
                  borderRadius: '6px',
                  marginTop: '10px'
                }}
              >
                {task.title}
              </div>
            ))}

            {/* Add Task Button */}
            <button
              onClick={() => openTaskModal(list.id)}
              style={{
                marginTop: '10px',
                padding: '8px',
                width: '100%',
                background: '#673ab7',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
