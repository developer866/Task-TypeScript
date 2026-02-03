import { useState } from "react";
import "./App.css";
import { InputField } from "./components/InputField";

const App= () => {
  const [todo,setTodo] = useState<string>("")
  console.log(todo);
  return(
   <>
    <div className="app">
      <span className="heading">helLo</span>
      <InputField setTodo={setTodo} todo={todo}/>
    </div>
  </>
  )
};

export default App;
