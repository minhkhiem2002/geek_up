import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Todo from "./pages/Todo/Todo";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

function App() {
  const client = new QueryClient()
  return (
    <div className = "App">
      <QueryClientProvider client = {client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<Todo />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
