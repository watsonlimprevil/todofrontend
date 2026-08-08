import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

export default function List({
  list,
  onRename,
  onDelete,
  onAddTask,
  showRenameListModal,
  TitleToEdit,
  setTitleToEdit,
  handleRenameList
}) {
  return (
    <Droppable droppableId={String(list.id)} key={list.id}>
      {(provided) => (
        <div
          className="list-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: "#1e1e1e",
            padding: "20px",
            borderRadius: "8px",
            width: "250px",
            minHeight: "100px",
          }}
        >
          <h3>{list.title}</h3>

          <button onClick={() => onRename(list.id)}>+ Rename</button>

          <button
            onClick={() => onDelete(list.id)}
            style={{
              background: "#b71c1c",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "white",
              marginLeft: "10px",
            }}
          >
            Delete List 🗑️
          </button>

          {showRenameListModal && (
            <div
              style={{
                background: "#1e1e1e",
                padding: "20px",
                borderRadius: "8px",
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
            <Task key={task.id} task={task} index={index} listId={list.id} />
          ))}

          {provided.placeholder}

          <button
            onClick={() => onAddTask(list.id)}
            style={{
              marginTop: "10px",
              padding: "8px",
              width: "100%",
              background: "#673ab7",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add Task
          </button>
        </div>
      )}
    </Droppable>
  );
}
