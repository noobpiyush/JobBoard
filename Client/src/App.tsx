import {  BrowserRouter as Router, Routes, Route  } from "react-router-dom"
import { Hero } from "./pages/Hero"
import { Nav } from "./pages/Nav"
import JobForm from "./pages/Dashboard"
import { Signin } from "./pages/Signin"


function App() {
  return (
   <Router>
    <Nav/>
     <Routes>
      <Route path="/" element={<Hero/>}/>
      <Route path="dashboard" element={<JobForm/>} />
      <Route path="/signin" element={<Signin/>} />
     </Routes>
   </Router>
  )
}

export default App


