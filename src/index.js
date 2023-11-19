import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Editor from './pages/Editor';
import Selection from './pages/Selection';
import Home from './pages/Home';
import Poster from './pages/Poster';
import Signup from './pages/SignUp';
import Login from './pages/Login';




import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "poster",
    element: <Poster />,
  },

  {
    path: "postercanvas",
    element: <Editor />,
  },
  {
    path: "product",
    element: <Selection />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);