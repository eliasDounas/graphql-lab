import "./index.css";
import Comments from './components/Comments/Comments';
import MainPage from './components/MainPage';
import CreatePost from './components/Posts/CreatePost';
import PostDisplay from './components/Posts/PostDisplay';
import PostFeed from './components/Posts/PostFeed';
import PostsByTag from './components/Posts/PostsByTag';
import TagsList from './components/TagsList';
import CreateUser from './components/Users/CreateUser';
import { UserDetails } from './components/Users/UserDetails';
import { UsersList } from './components/Users/UsersList'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/user" element={<UsersList />} />
        <Route path="/user/:userId" element={<UserDetails />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/posts" element={<PostFeed />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDisplay />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/tags" element={<TagsList />} />
        <Route path="/tags/:tag" element={<PostsByTag />} />
      </Routes>
    </Router>
  )
}

export default App
