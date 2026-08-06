import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../Api/client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import js from '@eslint/js';

export default function Board() {
  const { id } = useParams();
  const nav = useNavigate();
  const [lists, setLists] = useState([]);
  const [listTitle , setListTitle] = useState('')
  const [showListModal, setShowListModal] = useState(false);
  const [TitleToEdit, setTitleToEdit] = useState('');
  const [showRenameListModal , setShowRenameListModal] = useState(false);
  const [renameListId , setRenameListId] = useState(null);
  const [slectedTask , setSelectedTask] = useState([])
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [activeListId, setActiveListId] = useState(null);
  const [showTaskDetailsModal , setShowTaskDetailsModal] = useState(false)

useEffect(() => {
  async function loadBoard() {
    const listsFromServer = await api(`/lists/${id}`);

    const listsWithTasks = await Promise.all(
      listsFromServer.map(async (list) => {
        const tasks = await api(`/tasks/${list.id}`);
        return { ...list, tasks };
      })
    );

    setLists(listsWithTasks);
  }

  loadBoard();
}, [id]);

  async function handleCreateList() {
    console.log("boardIn (id):", id)
    const position = lists.length;
    const newList = await api(`/lists/${id}`, {
      method: 'POST',
      body: JSON.stringify({ title: listTitle , position: position})
    });

    setLists([...lists, newList]);
    setShowListModal(false);
    setListTitle('');
  }

  function openTaskModal(listId) {
    setActiveListId(listId);
    setShowTaskModal(true);
  }

  async function handleCreateTask() {
    const newTask = await api(`/tasks/${activeListId}`, {
      method: 'POST',
      body: JSON.stringify({ title: taskTitle })
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

async function persistMove(taskId, toListId, position) {
  await api(`/tasks/${taskId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ toListId, position })
  });
}



  function handleDragEnd(result) {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceListId = parseInt(source.droppableId);
    const destListId = parseInt(destination.droppableId);

    const sourceList = lists.find(list => list.id === sourceListId);
    const destList = lists.find(list => list.id === destListId);

    const sourceTasks = Array.from(sourceList.tasks || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceListId === destListId) {
    sourceTasks.splice(destination.index, 0, movedTask);

// ⭐ Reindex positions
      const reindexed = sourceTasks.map((task, index) => ({
       ...task,
         position: index
        }));

const updatedLists = lists.map(list =>
  list.id === sourceListId ? { ...list, tasks: reindexed } : list
);


      setLists(updatedLists);

      persistMove(draggableId, destListId, destination.index);
    } else {
      const destTasks = Array.from(destList.tasks || []);
    destTasks.splice(destination.index, 0, movedTask);

// ⭐ Reindex both lists
     const reindexedSource = sourceTasks.map((task, index) => ({
      ...task,
       position: index
      }));

      const reindexedDest = destTasks.map((task, index) => ({
       ...task,
        position: index
       }));

const updatedLists = lists.map(list => {
  if (list.id === sourceListId) return { ...list, tasks: reindexedSource };
  if (list.id === destListId) return { ...list, tasks: reindexedDest };
  return list;
});


      setLists(updatedLists);

      persistMove(draggableId, destListId, destination.index);
    }
  }

  async function handleDeleteList(listId){
    if(!window.confirm('Delete this list')) return;

    await api(`/lists/${listId}`, {method: 'DELETE'})

    const updated = lists.filter(list => list.id !== listId);
    setLists(updated)
  }

async function handleRenameList() {
  const updatedList = await api(`/lists/${renameListId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: TitleToEdit })
  });

  const updatedLists = lists.map(list =>
    list.id === renameListId
      ? { ...list, ...updatedList }   // ⭐ merge instead of replace
      : list
  );

  setLists(updatedLists);
  setShowRenameListModal(false);
  setTitleToEdit('');
}


async function handleDeleteTask(taskId , listId){
  await api(`/tasks/${taskId}` ,  {
    method : 'DELETE'
  });

  const updatedLists = lists.map(list => 
    list.id === listId ?
    {...list , tasks:list.tasks.filter(task => task.id !== taskId)}
    : list
  );
  setLists(updatedLists);
}
async function handleUpdateTask() {
  const updated = await api(`/tasks/${slectedTask.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: slectedTask.title,
      description: slectedTask.description,
      priority: slectedTask.priority,
      due_date: slectedTask.due_date
    })
  });

  // Merge updated task into the correct list
  const newLists = lists.map((list) => {
    if (list.id !== slectedTask.list_id) return list;

    return {
      ...list,
      tasks: list.tasks.map((t) =>
        t.id === updated.id ? updated : t
      )
    };
  });

  setLists(newLists);
  setShowTaskDetailsModal(false);
  setSelectedTask(null);
}


return (
  <div style={{ padding: '20px' }}>
    <button
      style={{
        padding: '10px 20px',
        background: '#444',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '20px'
      }}
      onClick={() => nav('/boards')}
    >
      Back to boards
    </button>

    <h1>Board #{id}</h1>

    {/* CREATE LIST BUTTON */}
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

    {/* CREATE LIST MODAL */}
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

          <button
            onClick={() => {
              setShowListModal(false);
              setListTitle('');
            }}
            style={{
              padding: '8px 12px',
              background: '#b71c1c',
              border: 'none',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    )}

    {/* CREATE TASK MODAL */}
    {showTaskModal && activeListId && (
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

          <button
            onClick={() => {
              setShowTaskModal(false);
              setTaskTitle('');
            }}
            style={{
              padding: '8px 12px',
              background: '#b71c1c',
              border: 'none',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    )}

    {/* TASK DETAILS MODAL (THE NEW FEATURE) */}
    {showTaskDetailsModal && slectedTask && (
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
            width: '350px'
          }}
        >
          <h2>Edit Task</h2>

          <input
            type="text"
            value={slectedTask.title}
            onChange={(e) =>
              setSelectedTask({ ...slectedTask, title: e.target.value })
            }
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />

          <textarea
            value={slectedTask.description || ''}
            onChange={(e) =>
              setSelectedTask({
                ...slectedTask,
                description: e.target.value
              })
            }
            placeholder="Description"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              height: '100px'
            }}

          />
          <select 
          value={slectedTask.priority || 'low'}
          onChange={(e) => 
            setSelectedTask({...slectedTask , priority:e.target.value})
          }

          style={{
            width : '100%',
            padding: '10px',
            marginTop : '10px',
            background: '#2e2e2e',
            color: 'white',
            borderRadius: '6px'
          }}
          >
            <option value={'low'}>Low Priority</option>
            <option value={'medium'}>Medium Priority</option>
            <option value={'high'}>High Priority</option>

          </select>

          <input 
          type='date'
          value={slectedTask.due_date || ''}
          onChange={(e) => 
            setSelectedTask({...slectedTask , due_date:e.target.value})
          }

          style={{
            width: '100%',
            padding : '10px',
            marginTop: '10px',
            background: '#2e2e2e',
            color : 'white',
            borderRadius : '6px'
          }}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              onClick={handleUpdateTask}
              style={{
                padding: '10px',
                background: '#4caf50',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Save
            </button>

            <button
              onClick={() => {
                setShowTaskDetailsModal(false);
                setSelectedTask(null);
              }}
              style={{
                padding: '10px',
                background: '#b71c1c',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'white',
                flex: 1
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* DND CONTEXT */}
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        {lists.map((list) => (
          <Droppable droppableId={String(list.id)} key={list.id}>
            {(provided) => (
              <div
                key={list.id}
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: '#1e1e1e',
                  padding: '20px',
                  borderRadius: '8px',
                  width: '250px',
                  minHeight: '100px'
                }}
              >
                <h3>{list.title}</h3>

                <button
                  onClick={() => {
                    setRenameListId(list.id);
                    setShowRenameListModal(true);
                  }}
                >
                  + Rename
                </button>

                <button
                  onClick={() => handleDeleteList(list.id)}
                  style={{
                    background: '#b71c1c',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: 'white',
                    marginLeft: '10px'
                  }}
                >
                  Delete List 🗑️
                </button>

                {showRenameListModal && (
                  <div
                    style={{
                      background: '#1e1e1e',
                      padding: '20px',
                      borderRadius: '8px'
                    }}
                  >
                    <input
                      value={TitleToEdit}
                      onChange={(e) => setTitleToEdit(e.target.value)}
                      placeholder="enter new name..."
                    />
                    <button onClick={handleRenameList}>Edit</button>
                  </div>
                )}

                {list.tasks?.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}


                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          background: '#2e2e2e',
                          padding: '10px',
                          borderRadius: '6px',
                          marginTop: '10px',
                          gap: '10px',
                          cursor: 'pointer',
                          ...provided.draggableProps.style
                        }}
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskDetailsModal(true);
                        }}
                      >
                        {task.title}

                          {/* ⭐ Priority indicator goes RIGHT HERE */}
                         <div style={{ fontSize: '12px', marginTop: '5px' }}>
                           {task.priority === 'high' && (
                              <span style={{ color: '#ff4d4d' }}>🔥 High</span>
                              )}
                             {task.priority === 'medium' && (
                             <span style={{ color: '#ffcc00' }}>⚠️ Medium</span>
                              )}
                             {task.priority === 'low' && (
                                <span style={{ color: '#4caf50' }}>🟢 Low</span>
                                 )}
                              </div>

                              {task.due_date && (
                                <div style={{fontSize : '12px', color : '#90caf9' , marginTop:'5px'}}>
                                  📆 Due : {task.due_date}
                                </div>
                              )}

                        <button
                          onClick={() =>
                            handleDeleteTask(task.id, list.id)
                          }
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b6b',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginLeft: '10px'
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

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
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  </div>
);

}