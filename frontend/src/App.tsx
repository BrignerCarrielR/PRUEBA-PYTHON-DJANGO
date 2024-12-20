import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Toaster} from 'react-hot-toast';
// Pagínas
import Home from "./pages/Home";
import PageDashboad from "./pages/PagesDashboard/PageDashboad.tsx";
import PageAuth from "./pages/PageAuth/PageAuth.tsx";
import PageMantenimientoUsuario from "./pages/PageMantenimientoUsuario/PageMantenimientoUsuario.tsx";
import PageIngresoMasivo from "./pages/PageIngresoMasivo/PageIngresoMasivo.tsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Definimos las rutas */}
                <Route path="/" element={<PageAuth/>}/>
                <Route path="/recuperar_contrasena" element={<PageAuth/>}/>
                <Route path="/dashboard" element={<Home contenido={<PageDashboad/>}/>}/>
                <Route path="/mantenimiento_usuario" element={<Home contenido={<PageMantenimientoUsuario/>}/>}/>
                              <Route path="/ingreso_masivo" element={<Home contenido={<PageIngresoMasivo/>}/>}/>
            </Routes>
            {/*definimos pora usar los Toast*/}
            <Toaster/>
        </Router>
    );
}

export default App;
