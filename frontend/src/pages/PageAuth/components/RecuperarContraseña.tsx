import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function RecuperarContraseA() {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [identificacion, setIdentificacion] = useState<string>('');
    const [mail, setMail] = useState<string>('');

    const EnviarContrasena = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        try {
            const response = await fetch('http://localhost:8000/api/recuperar_contrasena/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    identificacion,
                    email: mail,
                }),
            });

            if (!response.ok) {
                // Lanza un error con el mensaje que devuelva el servidor
                const errorData = await response.json();
                throw new Error(errorData.message || 'Usuario no encontrado o los datos no coinciden.');
            }

            const data = await response.json();
            console.log('Respuesta de la API:', data);
            toast.success('Se ha enviado la solicitud de recuperación correctamente.', {
                position: 'top-right',
            });

            // Redirigir solo después de recibir una respuesta exitosa
            navigate('/');

        } catch (err: any) {
            toast.error(err.message, {
                position: 'top-right',
            });
            console.log('Error en la API:', err.message);
        }
    };

    return (
        <div className="">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-3">Recuperar Contraseña</h1>
            <form className="space-y-4" onSubmit={EnviarContrasena}>
                <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="username">
                        Nombre de Usuario
                    </label>
                    <input
                        className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Ingresa tu nombre de usuario"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="identificacion">
                        Identificación
                    </label>
                    <input
                        className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Ingresa tu Ruc o Cédula"
                        type="text"
                        id="identificacion"
                        value={identificacion}
                        onChange={(e) => setIdentificacion(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600" htmlFor="mail">
                        Email
                    </label>
                    <input
                        className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Ingresa tu Email"
                        type="email"
                        id="mail"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                    Recuperar Contraseña
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <button onClick={() => navigate('/')} className="text-gray-800 font-medium hover:underline">
                        Iniciar sesión
                    </button>
                </p>
            </div>
        </div>
    );
}
