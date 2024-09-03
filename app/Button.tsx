'use client';

interface ButtonProps {
  handleOnClick: () => void;
  innerText: string
}

const Button = (props: ButtonProps) => {

  return (
    <button onClick={props.handleOnClick}>
    {props.innerText}
  </button>
  );

};
export default Button;