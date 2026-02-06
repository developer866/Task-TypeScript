interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

export const InputField = ({ todo, setTodo, handleAdd }: Props) => {
  return (
    <main className="w-full">
      <form className="flex gap-3 mb-6">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter a task"
          className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
        />
        <button 
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95" 
          type="submit" 
          onClick={handleAdd}
        >
          Add Task
        </button>
      </form>
    </main>
  );
};