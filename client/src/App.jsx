import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Slidebar from "./components/Slidebar";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import TimeTable from "./pages/TimeTable";
import Notes from "./pages/Notes";
import GPA from "./pages/GPA";
import Pomodoro from "./pages/Pomodoro";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";

function ProtectedLayout() {
  const { user } = useAuth();
  const [showSlidebar, setShowSlidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  if (!user) return <Navigate to="/login" />;

  useEffect(()=> {
    function handleResize(){
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSlidebar(false);
      } else {
        setShowSlidebar(true);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  },[])

  return (
    <div className={`min-h-screen bg-background font-sans flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {showSlidebar && <Slidebar onClose={() => setShowSlidebar(false)} overlay={isMobile} />}
      {!showSlidebar && (
        <button
          onClick={() => setShowSlidebar(true)}
          className="z-50 text-white bg-primary h-10 px-3 py-2 rounded-md hover:bg-primary/80 transition-colors shadow-lg"
        >
          ☰ Menu
        </button>
      )}
      <main className={`${isMobile ? 'w-full' : 'flex-1'} p-8`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/gpa" element={<GPA />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
        </Routes>
      </main>
    </div>
  );
}


function App() {

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/*" element={<ProtectedLayout/>} />
    </Routes>
  </BrowserRouter>)
}

export default App;
