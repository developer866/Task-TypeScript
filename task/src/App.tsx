import { useState } from "react";
import "./App.css";
import { InputField } from "./components/InputField";
import { Todo } from "./components/model";

const App = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      setTodos([...todos, { id: Date.now(), todo: todo, isDone: false }]);
      setTodo("");
      console.log(todos);
    }
  };
  return (
    <>
      <div className="app">
        <span className="heading">Task</span>
        <InputField setTodo={setTodo} todo={todo} handleAdd={handleAdd} />
      </div>
    </>
  );
};

export default App;
