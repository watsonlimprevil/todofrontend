import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../Api/client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import js from '@eslint/js';

export default function Board() {
  const { id } = useParams();
  const nav = useNavigate();
  const [lists, setLists] = useState([]);

  const [showListModal, setShowListModal] = useState(false);
  const [TitleToEdit, setTitleToEdit] = useState('');
  const [showRenameListModal , setShowRenameListModal] = useState(false);
  const [renameListId , setRenameListId] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [activeListId, setActiveListId] = useState(null);

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
  return (
    <div style={{ padding: '20px' }}>
      <button style={{
        padding: '10px 20px',
        background: '#444',
        border : 'none',
        borderRadius: '6px' ,
        cursor : 'pointer' ,
        marginBottom : '20px'
      }}
      onClick={() => nav('/boards')}
      >
        Back to boards
      </button>
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
                  <button onClick={() => {
                   setRenameListId(list.id);
                   setShowRenameListModal(true)
                  }}>
                    + Rename
                  </button>
                  {showRenameListModal && (
                    <div 
                    style={{
                      backgroundC: '#1e1e1e',
                      padding: '20px',
                      borderRadius: '8px'
                    }}>
                      <input 
                      value={TitleToEdit}
                      onChange={e => setTitleToEdit(e.target.value)}
                      placeholder='enter new name...'
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
                            ...provided.draggableProps.style
                          }}
                        >
                          {task.title}
                          < button onClick={ () =>handleDeleteTask(task.id , list.id)} 
                          
                          style={{
                            marginTop : '5px',
                            padding : '5px' ,
                            background : '#b71c1c' ,
                            border : 'none' ,
                            borderRadius : '4px' ,
                            cursor : 'pointer',
                            color : 'white'
                          }}>
                            Delete
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
