import useLocalStorage from "./useLocalStorage";
const useInput = (key, initialValue) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const reset = () => setValue(initialValue);

  const attributesObj = {
    value,
    onChange: (e) => setValue(e.target.value),
  };
  return [value, reset, attributesObj];
};

export default useInput;
