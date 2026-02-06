import { useState } from "react";
import "./App.css";
import { InputField } from "./components/InputField";
import type { Todo } from "./components/model";

const App = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t)=>t.isDone).length
  const openCount = todos.filter((t)=>!t.isDone).length
  
  const savedTodos = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDelete = (id: number) => {
    const updatedTodos = todos.filter((t) => t.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todo", JSON.stringify(updatedTodos));
  };

  const clearTodo = () => {
    setTodo([]);
    localStorage.removeItem("todo");
  };

  const handleDone = (id: number) => {
    const updatedTodos = todos.map((t) => {
      if (t.id === id) {
        return { ...t, isDone: !t.isDone };
      }
      return t;
    });
    savedTodos(updatedTodos);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    if (todo) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          todo: todo,
          isDone: false,
        },
      ]);
      setTodo("");
      console.log(todos);
    }
  };

  return (
    <>
      <div className="app">
        <span className="heading">Task</span>

        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <p>open Task:{openCount}</p>
        <p>finished  Task:{completedCount}</p>
        <p>Total Count:{totalCount}</p>
        <p>Open Task</p>
        {todos
          .filter((t) => !t.isDone)
          .map((t) => (
            <div key={t.id}>
              <p>{t.todo}</p>
              {/* <p>{t.id}</p> */}
              <button onClick={() => handleDone(t.id)}>
                Mark as {t.isDone ? "Undone" : "Done"}
              </button>
              <button
                onClick={() => {
                  handleDelete(t.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}

        <p>Completed list</p>

        {todos
          .filter((t) => t.isDone)
          .map((t) => (
            <div key={t.id}>
              <p>{t.todo}</p>

              <button onClick={() => handleDone(t.id)}>Undo</button>

              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          ))}
      </div>
      <button onClick={clearTodo}>Clear Todo</button>
    </>
  );
};

export default App;
