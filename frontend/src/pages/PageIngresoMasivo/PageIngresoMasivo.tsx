import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

interface ResultadoImportacion {
    usuario: string;
    mensaje: string | string[];  // Puede ser un solo mensaje o un arreglo de errores
}

export default function PageIngresoMasivo() {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
    const [resultados, setResultados] = useState<ResultadoImportacion[]>([]);

    const manejarCambioArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0] || null;
        setArchivoSeleccionado(archivo);

        if (!archivo) {
            toast.error("No se ha seleccionado un archivo.");
            return;
        }

        try {
            // Leer el archivo como array buffer
            const data = await archivo.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });

            // Verificar que haya al menos una hoja
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                toast.error("El archivo no contiene datos.");
                return;
            }

            // Mapeo de los datos
            const usuariosAEnviar = jsonData.map((fila: any) => ({
                Usuario: fila.Usuario,
                Contraseña: fila.Contraseña,
                Nombres: fila.Nombres,
                Apellidos: fila.Apellidos,
                Identificacion: fila.Identificacion,
                FechaNacimiento: fila.FechaNacimiento,
            }));

            // Hacer la solicitud a la API
            const response = await fetch('http://localhost:8000/api/ingreso_masivo/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuariosAEnviar),
            });

            const responseData = await response.json();

            if (response.ok) {
                setResultados([{ usuario: 'Todos', mensaje: responseData.message || 'Usuarios creados exitosamente.' }]);
                toast.success("Archivo procesado exitosamente.");
            } else {
                // Procesar los errores específicos de cada usuario
                const errores = responseData.errors.map((error: any) => ({
                    usuario: error.Usuario,
                    mensaje: error.errors.map((err: any) => err.error),  // Capturamos todos los errores para ese usuario
                }));
                setResultados(errores);
                toast.error("Hubo un problema al crear los usuarios.");
            }

        } catch (error: any) {
            toast.error(error.message || "Error al procesar el archivo.");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <p className="font-bold text-2xl text-gray-700">Ingreso Masivo de Usuarios</p>
            <p className="text-gray-600">Sube un archivo Excel para registrar usuarios de manera eficiente.</p>

            <div className="px-6 py-8 bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 3a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3zm2-1h6a1 1 0 011 1v14a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 text-lg">Arrastra o selecciona un archivo Excel (.xlsx)</span>
                            <input id="file-upload" type="file" accept=".xlsx,.csv" className="hidden" onChange={manejarCambioArchivo} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-10 w-full max-w-5xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full border-collapse table-auto text-sm text-gray-700">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 text-left font-medium">Usuario</th>
                        <th className="p-4 text-left font-medium">Mensaje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {resultados.map((resultado, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition">
                            <td className="p-4 border-b border-gray-200">{resultado.usuario}</td>
                            <td className="p-4 border-b border-gray-200">
                                {Array.isArray(resultado.mensaje) ? (
                                    <ul>
                                        {resultado.mensaje.map((error, i) => (
                                            <li key={i}>{error}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    resultado.mensaje
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {resultados.length === 0 && (
                    <p className="text-center text-gray-500 py-6">No se han importado usuarios aún.</p>
                )}
            </div>
        </div>
    );
}
