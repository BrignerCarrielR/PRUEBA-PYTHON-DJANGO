import {useEffect, useState} from 'react';
import * as js2xmlparser from 'js2xmlparser';
import {toast} from "react-hot-toast";

interface Session {
    id: number;
    FechaIngreso: string;
    FechaCierre: string | null;
    is_active: boolean;
    Usuario: number;
}

interface Pokemon {
    name: string;
    image: string;
}

export default function PageSesionReport() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const idUsuario = Number(localStorage.getItem('IdUsuario'));


    useEffect(() => {
        fetch('http://localhost:8000/api/sessions/')
            .then((response) => response.json())
            .then((data) => {
                setSessions(data);
            })
            .catch((error) => console.error('Error al obtener las sesiones:', error));
    }, []);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon/1/')
            .then((response) => response.json())
            .then((data) => {
                setPokemon({
                    name: data.name,
                    image: data.sprites.front_default,
                });
            })
            .catch((error) => console.error('Error al obtener el Pokémon:', error));
    }, []);

    // Función para generar el XML del reporte
    const generateXmlReport = () => {
        const xmlData = {
            sessions: {
                session: sessions.map((session) => ({
                    id: session.id,
                    FechaIngreso: session.FechaIngreso,
                    FechaCierre: session.FechaCierre,
                    is_active: session.is_active,
                    Usuario: session.Usuario,
                })),
            },
        };

        const xml = js2xmlparser.parse('root', xmlData);
        return xml;
    };

    // Función para guardar el reporte XML en la base de datos
    const saveXmlReport = async () => {
        const xml = generateXmlReport();
        console.log(xml);
        try {
            const response = await fetch('http://localhost:8000/api/session-reports/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({xml_data: xml, userID: idUsuario}),
            });

            if (response.ok) {
                toast.success('Reporte guardado correctamente', {
                    position: 'top-right',
                });
            } else {
                toast.error('Error al guardar el reporte.', {
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error('Error al guardar el reporte:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Reporte de Sesiones</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                    <div key={session.id}
                         className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <p className="text-lg font-medium text-gray-700"><strong>Sesión ID:</strong> {session.id}</p>
                        <p className="text-sm text-gray-600"><strong>Fecha de Ingreso:</strong> {session.FechaIngreso}
                        </p>
                        <p className="text-sm text-gray-600"><strong>Fecha de
                            Cierre:</strong> {session.FechaCierre || 'Activo'}</p>
                        <p className="text-sm text-gray-600"><strong>Usuario:</strong> {session.Usuario}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Estado:</strong> {session.is_active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                {pokemon ? (
                    <div className="max-w-xs mx-auto">
                        <h2 className="text-xl font-semibold text-gray-800">Imagen del Pokémon: {pokemon.name}</h2>
                        <img className="w-full mt-4 rounded-lg shadow-md" src={pokemon.image} alt={pokemon.name}/>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">Cargando imagen del Pokémon...</p>
                )}
            </div>
            <div className="mt-8 flex justify-center">
                <button
                    onClick={saveXmlReport}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                    Crear Reporte XML
                </button>
            </div>
        </div>
    );
}
