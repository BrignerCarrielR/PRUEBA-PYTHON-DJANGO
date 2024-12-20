CREATE OR REPLACE FUNCTION public.datosultimasession(id_usuario integer)
 RETURNS TABLE(username character varying, mail character varying, usuarioestado character varying, fechaingresosesion timestamp with time zone, fechacierresesion timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        u."UserName", 
        u."Mail", 
        u."Status" AS UsuarioEstado, 
        s."FechaIngreso" AS FechaIngresoSesion, 
        s."FechaCierre" AS FechaCierreSesion
    FROM 
        main_usuario u
    JOIN 
        main_persona p ON u."Persona_id" = p."idPersona"
    LEFT JOIN 
        main_session s ON u."idUsuario" = s."Usuario_id"
    WHERE 
        u."idUsuario" = id_usuario
        AND s."FechaIngreso" = (
            SELECT MAX("FechaIngreso") 
            FROM main_session m
            WHERE "Usuario_id" = u."idUsuario"
        )
    ORDER BY 
        s."FechaIngreso" DESC 
    LIMIT 1;
END;
$function$
;