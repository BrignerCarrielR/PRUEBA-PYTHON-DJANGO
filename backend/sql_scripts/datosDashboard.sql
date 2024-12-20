CREATE OR REPLACE FUNCTION public.datosdashboard()
 RETURNS TABLE(activos bigint, inactivos bigint, bloqueados bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        count(*) filter (where mu."Status"= 'Activo') as activos,
        count(*) filter (where mu."Status"= 'Inactivo') as inactivos,
        count(*) filter (where mu."Status"= 'Bloqueado') as bloqueados
    FROM
        main_usuario mu;
END;
$function$
;