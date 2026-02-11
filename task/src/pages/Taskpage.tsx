import { useState } from "react";

import { InputField } from "../components/InputField";
import type { Todo } from "../components/model";


const Taskpage = () => {
  const [todo, setTodo] = useState<string>("");
  const [error,setError] = useState<string>("")
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
    setTodos([]);
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
    if (!todo){
      setError("Input Field can be Empty")
      return
    };
    setError("")

    if (todo) {
      setTodos([
        {
          id: Date.now(),
          todo: todo,
          isDone: false,
        },
        ...todos
      ]);
      setTodo("");
      console.log(todos);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Task Manager</h1>
          <InputField todo={todo} error={error} setTodo={setTodo} handleAdd={handleAdd} />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Open Tasks</p>
            <p className="text-2xl font-bold text-blue-600">{openCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Finished Tasks</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Count</p>
            <p className="text-2xl font-bold text-purple-600">{totalCount}</p>
          </div>
        </div>

        {/* Open Tasks Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Open Tasks
          </h2>
          <div className="space-y-3">
            {todos
              .filter((t) => !t.isDone)
              .map((t) => (
                <div 
                  key={t.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <p className="text-gray-800 flex-1">{t.todo}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDone(t.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Mark as {t.isDone ? "Undone" : "Done"}
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(t.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            {openCount === 0 && (
              <p className="text-gray-400 text-center py-8 italic">No open tasks. Great job! 🎉</p>
            )}
          </div>
        </div>

        {/* Completed Tasks Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Completed Tasks
          </h2>
          <div className="space-y-3">
            {todos
              .filter((t) => t.isDone)
              .map((t) => (
                <div 
                  key={t.id}
                  className="bg-green-50 rounded-lg p-4 flex items-center justify-between hover:bg-green-100 transition-colors duration-200 border border-green-200"
                >
                  <p className="text-gray-600 line-through flex-1">{t.todo}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDone(t.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Undo
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            {completedCount === 0 && (
              <p className="text-gray-400 text-center py-8 italic">No completed tasks yet</p>
            )}
          </div>
        </div>

        {/* Clear All Button */}
        <div className="flex justify-center pt-4 border-t border-gray-200">
          <button 
            onClick={clearTodo}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Clear All Tasks
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Taskpage;