import Content from "../../components/Content/Content";
import Header from "../../components/Header/Header";
import React, { useEffect } from "react";
import "./Todo.scss";
const Todo = () => {
  useEffect(() => {
    document.title = "To do - Test";
  }, []);
  return (
    <div className="todo">
      <Header />
      <Content />
    </div>
  );
};
export default Todo;
