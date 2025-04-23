import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Changelog from "./pages/ChangeLog";
import NotFound from "./pages/NotFound";
import FlashcardCreate from "./pages/Flashcard/FlashcardCreate";
import FlashcardEdit from "./pages/Flashcard/FlashcardEdit";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Flashcard = lazy(() => import("./pages/Flashcard/Flashcard"));
const GamesFlashcard = lazy(() => import("./pages/Flashcard/GameFlashcard"));
const Setting = lazy(() => import("./pages/Flashcard/Setting"));
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
          path="/flashcard"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <Flashcard />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/flashcard/new"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <FlashcardCreate />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/flashcard/edit/:id"
          element={
            <div style={{ backgroundColor: "#1A202C", minHeight: "100vh" }}>
              <ProtectedRoute>
                <FlashcardEdit />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/flashcard/setting"
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
