import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PageDashboard() {
    const [activos, setActivos] = useState<number>(0);
    const [inactivos, setInactivos] = useState<number>(0);
    const [bloqueados, setBloqueados] = useState<number>(0);// Agregar un estado de carga


    useEffect(() => {
        // Función asíncrona dentro de useEffect
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/info_dashboard/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Lanza un error con el mensaje que devuelva el servidor
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error desconocido');
                }

                const data = await response.json();
                console.log('Respuesta de la API:', data);

                // Actualiza los estados con los datos recibidos
                setActivos(data.activos);
                setInactivos(data.inactivos);
                setBloqueados(data.bloqueados);
            } catch (err: any) {
                toast.error(err.message, {
                    position: 'top-right',
                });
                console.log('Error en la API:', err.message);
            }
        };

        fetchData();

    }, []); // El array vacío asegura que solo se ejecute una vez al montar


    return (
        <div className="p-8 bg-gray-100">
            <p className="text-3xl font-bold text-gray-800 mb-4">Dashboard de Administrador</p>
            <p className="text-gray-600">Información del estado actual de los usuarios en tiempo real.</p>
            <div className="p-6 bg-gray-100">
                {/* Panel de Indicadores */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Indicador de Usuarios Activos */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-indigo-600">
                        <h3 className="text-lg font-medium text-gray-700">Usuarios Activos</h3>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">{activos}</p>
                        <p className="text-sm text-gray-500">Usuarios actualmente activos en el sistema</p>
                    </div>

                    {/* Indicador de Usuarios Inactivos */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-red-600">
                        <h3 className="text-lg font-medium text-gray-700">Usuarios Inactivos</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">{inactivos}</p>
                        <p className="text-sm text-gray-500">Usuarios que no han iniciado sesión recientemente</p>
                    </div>

                    {/* Indicador de Usuarios Bloqueados */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-gray-500">
                        <h3 className="text-lg font-medium text-gray-700">Usuarios Bloqueados</h3>
                        <p className="text-3xl font-bold text-gray-500 mt-2">{bloqueados}</p>
                        <p className="text-sm text-gray-500">Usuarios con acceso restringido</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

