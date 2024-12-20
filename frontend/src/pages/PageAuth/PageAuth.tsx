import {useLocation} from "react-router-dom";

import LoginFormulario from "./components/LoginFormulario.tsx";
import RecuperarContraseA from "./components/RecuperarContraseña.tsx";

export default function PageAuth() {
    const location = useLocation();
    console.log(location);
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-300">
            <div className="w-96 bg-white rounded-xl p-6 drop-shadow-2xl">
                {location.pathname === "/" && (
                    <LoginFormulario/>
                )}
                {location.pathname === "/recuperar_contrasena" && (
                    <RecuperarContraseA/>
                )}
            </div>
        </div>
    )
}