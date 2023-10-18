// App.js

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Roles from "./pages/Role";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Game from "./pages/Game";
import EvaluationSentence from "./pages/EvaluationSentence";
import FinalSentence from "./pages/FinalSentence";
import Scoreboard from "./pages/Scoreboard";
import SentenceList from "./pages/SentenceList";
import UserList from "./pages/UserList";
import { AuthProvider, useAuth } from "./context/AuthContext";

// ...

export const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};
function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/main" element={<PrivateRoute />}>
            <Route index element={<Roles />} />
            <Route path="/main/profile" element={<Profile />} />
            <Route path="/main/user-list" element={<UserList />} />
            <Route path="/main/sentence-list" element={<SentenceList />} />
            <Route path="/main/score-board" element={<Scoreboard />} />
            <Route path="/main/final-sentence" element={<FinalSentence />} />
            <Route
              path="/main/evaluation-sentence"
              element={<EvaluationSentence />}
            />
            <Route path="/main/game" element={<Game />} />
          </Route>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
