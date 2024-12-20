import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import React from "react";
import {obtenerHora} from "../utils/Hora.ts";
import {useEffect, useState} from "react";

interface HomeProps {
    contenido: React.ReactNode; // ReactNode prespesentra lo que react puede renderizar
}

export default function Home({contenido}: HomeProps) {
    // estado para almacenar el tiempo
    const [hora, setHora] = useState<string>('');

    useEffect(() => {
        const intervalo = setInterval(() => {
            setHora(obtenerHora());
        }, 1000);

        // limpiamos el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalo);
    }, []);
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="flex flex-col flex-grow lg:flex-row">
                <div className="lg:w-80">
                    <Sidebar/>
                </div>
                <div className="flex flex-col bg-gray-200 w-full">
                    <div className="flex-grow p-5 overflow-y-auto h-[calc(100vh-160px)]">
                        {contenido}
                    </div>
                    <div
                        className="flex font-extrabold justify-end items-center bg-gray-300 text-black text-opacity-50 text-sm h-14 py-2 text-end px-5">
                        <p>{hora}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
