import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Editor from './Editor';
import Selection from './Selection';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "editor",
    element: <Editor />,
  },
  {
    path: "/",
    element: <Selection />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>
);