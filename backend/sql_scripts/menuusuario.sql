CREATE OR REPLACE FUNCTION public.menuusuario(id_usuario integer)
 RETURNS TABLE(idopcion integer, rolname character varying, nombreopcion character varying, url character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    select mr3."idOpcion", mr4."RolName",  mr3."NombreOpcion", mr3."Url" 
from main_usuario mu, main_rolusuario mr, main_rolrolopciones mr2, main_rolopciones mr3, main_rol mr4 
where mu."idUsuario" = mr."Usuario_id" and mr."Rol_id" = mr4."idRol" and mr4."idRol" = mr2."Rol_id" and mr2."RolOpciones_id" = mr3."idOpcion" and mu."idUsuario"=id_usuario ;
END;
$function$
;