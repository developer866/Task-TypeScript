interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
}
export const InputField = ({ todo, setTodo }: Props) => {
  return (
    <main>
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="Enter a task"
        className="input__box"
      />
      <button className="input__submit" type="submit">
        Go
      </button>
    </main>
  );
};
