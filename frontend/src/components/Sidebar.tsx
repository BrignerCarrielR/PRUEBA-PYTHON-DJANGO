import {useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const idUsuario = Number(localStorage.getItem('IdUsuario'));
    const [menu, setMenu] = useState<any[]>([]);

    // Función para verificar si el path actual es activo
    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        // Función asíncrona para obtener el menú desde la API
        const fetchMenu = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/menu_usuario/${idUsuario}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error desconocido');
                }

                const data = await response.json();
                console.log('Respuesta de la API:', data);

                // Actualiza el estado del menú
                setMenu(data);
            } catch (err: any) {
                console.log('Error en la API:', err.message);
            }
        };

        fetchMenu(); // Llamar a la función para obtener el menú al montar el componente
    }, [idUsuario]); // Dependencia de idUsuario para recargar si cambia

    return (
        <div className="bg-gray-50 h-full w-64 flex flex-col p-5 space-y-4 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Panel de Control
            </h2>

            {/* Recorre el menú y muestra los botones dinámicamente */}
            {menu.map((item) => (
                <button
                    key={item.idopcion} // Usamos una clave única para cada botón
                    className={
                        isActive(item.ruta)
                            ? 'flex items-center space-x-3 p-3 rounded-lg bg-blue-100 transition group border-blue-700 border-l-4'
                            : 'flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100 transition group'
                    }
                    onClick={() => navigate(item.url)} // Navegar a la ruta proporcionada por el ítem
                >
                    <span className="text-gray-500 group-hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
                        </svg>

                    </span>
                    <p className="text-gray-700 group-hover:text-blue-700 font-medium">
                        {item.nombreopcion} {/* Mostrar el nombre del ítem */}
                    </p>
                </button>
            ))}
        </div>
    );
}
