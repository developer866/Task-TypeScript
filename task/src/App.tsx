import { useState,useEffect } from "react";
import "./App.css";
import { InputField } from "./components/InputField";
import type { Todo } from "./components/model";

const App = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  // const{isDone,setIsDone}=useState<boolean>(false)
  
  const handleDone=(id:number)=>{
    setTodos(todos.map((t)=>{
      if(t.id===id){
        return{...t,isDone:!t.isDone}
      }
      return t;
    }))
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

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
        <p>Open Task</p>
        {todos.filter((t) => !t.isDone).map((t) => (
          <div key={t.id}>
            <p>{t.todo}</p>
            <p>{t.id}</p>
            <button onClick={()=>handleDone(t.id)}>Mark as {t.isDone ? "Undone":"Done"}</button>
          </div>
        ))}

        <p>Completed list</p>
        {todos.map((t) => (
          <div key={t.id}>
            {t.isDone && <p>{t.todo}</p>}
            {t.id}
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
