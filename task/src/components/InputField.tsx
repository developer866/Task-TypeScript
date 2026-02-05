interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}
export const InputField = ({ todo, setTodo, handleAdd }: Props) => {
  return (
    <main>
      <form action="">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter a task"
          className="input__box"
        />
        <button className="input__submit" type="submit" onClick={handleAdd}>
          Go
        </button>
      </form>
    </main>
  );
};
