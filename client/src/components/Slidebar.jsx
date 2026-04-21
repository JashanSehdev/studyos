import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Links = [
  { to: "/", icon: "🏚️", label: "Dashboard" },
  { to: "/assignments", icon: "📋", label: "Assignments" },
  { to: "/timetable", icon: "🗓️", label: "Timetable" },
  { to: "/notes", icon: "📝", label: "Notes" },
  { to: "/gpa", icon: "🎯", label: "GPA" },
  { to: "/pomodoro", icon: "⏱️", label: "Pomodoro" },
];

export default function Slidebar({ onClose, overlay = false }) {
    const [user, setUser] = useState('Unknown User');
    const [email, setEmail] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        try {
            const userData = JSON.parse(storedUser);
            if (userData?.name) setUser(userData.name);
            if (userData?.email) setEmail(userData.email);
        } catch (error) {
            console.error('Invalid user data in localStorage:', error);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            navigate('/login');
        }
    };
    
    return (
        <aside className={`${overlay ? 'fixed inset-0 z-50' : 'w-64 min-h-screen'} bg-surface flex flex-col py-8 px-4 gap-2`}>

            {/* LOGO */}
            <div className="mb-8 px-2 flex items-center justify-between">
                <div>
                    <h1 className="text-primary text-2xl font-bold">StudyOS</h1>
                    <p className="text-gray-500 text-xs mt-1">Your academic cockpit</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                    aria-label="Close sidebar"
                >
                    ✕
                </button>
            </div>


            {/* NavLinks */}

            {Links.map(link => (
                <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => overlay && onClose && onClose()}

                className= {({isActive})=> `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                            ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
                            }
                >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                </NavLink>
            ))}


             {/* Bottom user tag */}

             <div className="mt-auto px-2 py-3 rounded-xl bg-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                    {user ? `${user.charAt(0).toUpperCase()}` : ''}
                </div>
                <div>
                    
                    <p className="text-white text-xs font-semibold">{user}</p>
                    <p className="text-gray-500 text-xs">{email}</p>
                </div>
             </div>
            <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-4 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
            >
                Logout
            </button>

        </aside>
    )
}
