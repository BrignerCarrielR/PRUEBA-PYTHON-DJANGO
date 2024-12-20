import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function LoginFormulario() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Función para iniciar sesión
    const IniciarSesion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Solicitud para iniciar sesión
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                // Manejar el error si no es ok
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error desconocido');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            toast.success('Se ha iniciado la sesión correctamente', {
                position: 'top-right',
            });


            localStorage.setItem('user', String(username));

            // Buscar el ID del usuario
            await fetchIdUsuario(username);
            // Una vez que se haya iniciado sesión, redirigimos al dashboard
            navigate('/dashboard');

        } catch (err: any) {
            toast.error(err.message, {
                position: 'top-right',
            });
            console.log('Error en la API:', err.message);
        } finally {
            setLoading(false); // Desactivar el loading
        }
    };

    // Función para obtener el ID del usuario
    const fetchIdUsuario = async (username: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/usuarios/buscar_usuario/?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener el ID del usuario');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            localStorage.setItem('IdUsuario', String(data.idUsuario));

        } catch (err: any) {
            toast.error(err.message, {
                position: 'top-right',
            });
            console.log('Error al obtener el ID del usuario:', err.message);
        }
    };

    return (
        <div className="">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
            <form className="space-y-6" onSubmit={IniciarSesion}>
                <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="username">
                        Nombre de Usuario
                    </label>
                    <input
                        id="username"
                        value={username}  // Vinculamos el valor del input con el estado
                        onChange={(e) => setUsername(e.target.value)}  // Actualizamos el estado cuando el usuario escribe
                        className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Ingresa tu nombre de usuario"
                        type="text"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        value={password}  // Vinculamos el valor del input con el estado
                        onChange={(e) => setPassword(e.target.value)}  // Actualizamos el estado cuando el usuario escribe
                        className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Ingresa tu contraseña"
                        type="password"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}  // Deshabilitar el botón mientras está cargando
                    className="w-full py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                    {loading ? 'Iniciando sesión...' : 'Acceder'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    ¿Olvidaste tu contraseña?{" "}
                    <a
                        onClick={() => navigate('/recuperar_contrasena')}
                        className="text-gray-800 font-medium hover:underline"
                    >
                        Recuperar contraseña
                    </a>
                </p>
            </div>
        </div>
    );
}
