import {useState} from "react";
import {toast} from "react-hot-toast"
import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const storedUser = localStorage.getItem('user');
    const idUsuario = Number(localStorage.getItem('IdUsuario'));


    // Función para abrir el modal
    const abrirModal = () => setModal(true);

    // Función para cerrar el modal
    const CerrarModal = () => setModal(false);

    const CerrarSesion = () => {
        const fetchLogut = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/logout/${idUsuario}/`, {
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
                toast.success('Se ha cerrado la sesión correctamente', {
                    position: 'top-right'
                });

            } catch (err: any) {
                toast.error(err.message, {
                    position: 'top-right',
                });
                console.log('Error en la API:', err.message);
            }
        };
        fetchLogut()
        navigate('/');
    }
    return (
        <div>
            <div className="bg-gray-700 bg-opacity-90 h-14 flex items-center justify-between px-3 sm:pl-10 sm:pr-3">
                <div className="text-white text-xl font-extrabold">
                    <button onClick={()=> navigate('/dashboard')}>Control de Acceso</button>
                </div>
                <div className="flex text-sm text-white space-x-4">
                    <div className="flex items-center" onClick={abrirModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="h-6 w-6">
                            <path
                                fillRule="evenodd"
                                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="h-5 w-5">
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="hidden sm:block">
                        <p className="font-bold">
                            <span className="font-bold opacity-80 "></span>Usuario: {storedUser}
                        </p>
                        <p className="opacity-70 uppercase">
                            Bienvenido
                        </p>
                    </div>
                </div>
            </div>

            {/* verificamos el estado del modal */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-center mb-4">Cerrar sesión</h2>
                        <p className="text-center mb-6">
                            ¿Estás seguro de que quieres cerrar sesión?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={CerrarSesion}
                                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                                Sí, cerrar sesión
                            </button>
                            <button onClick={CerrarModal}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
