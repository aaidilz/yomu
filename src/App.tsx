import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Changelog = lazy(() => import("./pages/ChangeLog"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const FeedBack = lazy(() => import("./pages/FeedBack"));
const About = lazy(() => import("./pages/About"));

// dictionary
const Dictionary = lazy(() => import("./pages/Dictionary/Dictionary"));
const DictionaryCreate = lazy(
  () => import("./pages/Dictionary/DictionaryCreate")
);
const DictionaryEdit = lazy(() => import("./pages/Dictionary/DictionaryEdit"));
const Setting = lazy(() => import("./pages/Dictionary/Setting"));
// games
const GamesFlashcard = lazy(
  () => import("./pages/Games/Flashcard/GameFlashcard")
);

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
        <Route path="/about" element={<About />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/feedback" element={<FeedBack />} />
        {/* Public Routes */}

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <Dictionary />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/new"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <DictionaryCreate />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/edit/:id"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <DictionaryEdit />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/dictionary/setting"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/games-flashcard"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <GamesFlashcard />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/games-quiz"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <GamesQuiz />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <NoteList />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/new"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/edit/:id"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/note/:id"
          element={
            <div className="bg-gray-900 min-h-screen w-full overflow-x-hidden">
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
