
import './App.css'
import { UserDetails } from './components/Users/UserDetails';
import { UsersList } from './components/Users/UsersList'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/user/:userId" element={<UserDetails />} />
      </Routes>
    </Router>
  )
}

export default App
