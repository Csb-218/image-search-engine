import {Routes,Route} from "react-router"
import Home from "./pages/Home"
import ImageIndex from "./pages/ImageIndex";

function App() {
 

 return(
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/upload" element={<ImageIndex/>} />
    </Routes>
 )
}

export default App;
