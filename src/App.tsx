import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Changelog from "./pages/ChangeLog";
import NotFound from "./pages/NotFound";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
// dictionary
const Dictionary = lazy(() => import("./pages/Dictionary/Dictionary"));
const DictionaryCreate = lazy(() => import("./pages/Dictionary/DictionaryCreate"));
const DictionaryEdit = lazy(() => import("./pages/Dictionary/DictionaryEdit"));
const Setting = lazy(() => import("./pages/Dictionary/Setting"));
// games
const GamesFlashcard = lazy(() => import("./pages/Games/Flashcard/GameFlashcard"));

const GamesQuiz = lazy(() => import("./pages/Games/Quiz/GameQuiz"));

// note
const NoteList = lazy(() => import("./pages/Note/NoteList"));
const NoteEditor = lazy(() => import("./pages/Note/NoteEditor"));
const NotePreview = lazy(() => import("./pages/Note/NotePreview"));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <Dictionary />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/new"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <DictionaryCreate />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/edit/:id"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <DictionaryEdit />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/setting"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/games-flashcard"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <GamesFlashcard />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/games-quiz"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <GamesQuiz />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <NoteList />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/new"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/edit/:id"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/:id"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <NotePreview />
              </ProtectedRoute>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
