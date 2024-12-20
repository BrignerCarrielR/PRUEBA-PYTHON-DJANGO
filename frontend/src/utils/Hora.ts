// Función que retorna la hora en formato de 12 horas (AM/PM)
export const obtenerHora = (): string => {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const segundos = ahora.getSeconds();

    // Determinar si es AM o PM
    const amPm = horas >= 12 ? 'PM' : 'AM';

    // Convertir a formato de 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // El 0 debe ser 12 en formato de 12 horas

    // Formatear minutos y segundos para que siempre tenga dos dígitos
    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;

    // Crear la cadena con el formato de hora
    return `${horas}:${minutosFormateados}:${segundosFormateados} ${amPm}`;
};
