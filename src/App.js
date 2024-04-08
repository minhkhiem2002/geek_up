import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./pages/User/Page";
import Todo from "./pages/Todo/Todo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
