app.factory("servicios", function($http,config) {
    /**
    * Consume servicio rest por medio POST
    * @param  {object}
    * @return  {promise}
    */
    var consumirServicio = function(obj){
        let ruta = config.servicio;
        return $http.post(ruta,obj);
    };
    return {
        usuarios:{
            registrar: (usuario) => {
                let obj = {
                    opcion:1,
                    servicio:'usuarios',
                    usuario:usuario
                }
                return consumirServicio(obj);
            }
        },
        solicitudes:{
            registrar: (obj) => {
                obj.opcion = 1;
                obj.servicio = 'solicitudes';
                return consumirServicio(obj);
            },
            consultarHistorial: (usuario) => {
                return consumirServicio({
                    opcion:3,
                    servicio:'solicitudes',
                    usuario:usuario
                });
            },
            consultarPendientes: (usuario) => {
                return consumirServicio({
                    opcion:4,
                    servicio:'solicitudes',
                    usuario:usuario
                });
            },
            actualizar: (obj) => {
                obj.opcion = 5;
                obj.servicio = 'solicitudes';
                return consumirServicio(obj);
            }
        },
        validarRespuesta: (respuesta) => {
            //Valida si la respuesta cuenta con datos validos
            if(respuesta&&respuesta.data&&respuesta.data.data
                &&respuesta.data.data.length&&respuesta.data.data[0].estado==0
            ){
                return true;
            }else{
                return false;
            }
        }
    };
});