import React from "react";
import "./App.css";
import { Task } from "./features/task/Task";

function App() {
  return (
    <div className="container">
      <div className="sidebar"></div>
      <div className="main">
        <header className="header"></header>
        <Task />
      </div>
    </div>
  );
}

export default App;
