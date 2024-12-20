import { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";

interface Usuario {
    idUsuario: number;
    UserName: string;
    Mail: string;
    Password: string;
    SessionActive: string;
    Persona: string;
    Status: string;
    is_active: boolean;
}

export default function PageMantenimientoUsuario() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/usuarios/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cargar usuarios.');
            }

            const data: Usuario[] = await response.json();
            setUsuarios(data);
            setFilteredUsuarios(data);
        } catch (error: any) {
            toast.error(error.message, { position: 'top-right' });
        }
    };

    const filtrarUsuarios = (e: React.ChangeEvent<HTMLInputElement>) => {
        const termino = e.target.value.toLowerCase();
        setFilteredUsuarios(
            usuarios.filter(user =>
                user.UserName.toLowerCase().includes(termino) ||
                user.Mail.toLowerCase().includes(termino)
            )
        );
    };

    const actualizarUsuario = async () => {
        if (!usuarioSeleccionado) {
            toast.error('Seleccione un usuario para actualizar.', { position: 'top-right' });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/usuarios/${usuarioSeleccionado.idUsuario}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioSeleccionado),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar usuario.');
            }

            toast.success('Usuario actualizado correctamente.', { position: 'top-right' });
            cargarUsuarios();
        } catch (error: any) {
            toast.error(error.message, { position: 'top-right' });
        }
    };

    const cambiarEstadoUsuario = async (usuario: Usuario) => {
        const nuevoEstado = usuario.Status === 'Activo' ? 'Inactivo' : 'Activo';
        const usuarioActualizado = { ...usuario, Status: nuevoEstado };

        try {
            const response = await fetch(`http://localhost:8000/api/usuarios/${usuario.idUsuario}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioActualizado),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al cambiar el estado del usuario.');
            }

            toast.success(`Estado actualizado a ${nuevoEstado}.`, { position: 'top-right' });
            cargarUsuarios();
        } catch (error: any) {
            toast.error(error.message, { position: 'top-right' });
        }
    };

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Mantenimiento de Usuarios</h1>
            <p className="text-gray-600 mb-6">Administra y modifica la información de los usuarios registrados en el sistema.</p>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-700">Buscar por nombre o correo:</p>
                    <input
                        onChange={filtrarUsuarios}
                        className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa el nombre o correo"
                    />
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
                        <th className="p-3">Usuario</th>
                        <th className="p-3">Correo</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsuarios.map(usuario => (
                        <tr key={usuario.idUsuario} className="border-t hover:bg-gray-100">
                            <td className="p-3 text-gray-700">{usuario.UserName}</td>
                            <td className="p-3 text-gray-700">{usuario.Mail}</td>
                            <td className="p-3 text-gray-700">{usuario.Status}</td>
                            <td className="p-3 space-x-2">
                                <button
                                    onClick={() => setUsuarioSeleccionado(usuario)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => cambiarEstadoUsuario(usuario)}
                                    className="text-red-500 hover:underline"
                                >
                                    Cambiar Estado
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {usuarioSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Usuario</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={usuarioSeleccionado.UserName}
                                onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, UserName: e.target.value })}
                                placeholder="Nombre de usuario"
                            />
                            <input
                                type="email"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={usuarioSeleccionado.Mail}
                                onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, Mail: e.target.value })}
                                placeholder="Correo electrónico"
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setUsuarioSeleccionado(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={actualizarUsuario}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
