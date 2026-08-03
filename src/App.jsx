import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoutes';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import Login from './pages/Login';
import Boards from './pages/Boards';
import Signup from './pages/SignUp';

export default function App(){
return(
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Signup />} />

      <Route
        path="/boards"
        element={
          <protectedRoute>
            <Boards />
          </protectedRoute>
        }
      />
    </Routes>
  </AuthProvider>
</BrowserRouter>
)
}