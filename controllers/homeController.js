app.controller('homeController', function($scope, $http, datos, servicios, config) {
    // Variable utilizada para manejar la actualizacion de solicitudes
    var tarea;
    // Objeto que almacena las solicitudes con historial o pendientes
    $scope.solicitudes ={
        historial:[],
        pendientes:[]
    }
    // Nombre del usuario que inicia sesion
    $scope.usuario = '';
    // Objeto donde que almacena los colores a utilizar
    // P-pendientes, A-aceptado, R-rechazado
    $scope.color = {
        P:'grey',
        A:'green',
        R:'red'
    };
    // Objeto que almacena los datos para una nueva solicitud
    $scope.nuevaSolicitud = {
        usuario:datos.usuario,
        edad:0,
        tarjeta:0,
        plazo:0,
        interes:0,
        solicitado:0,
        total:0,
    };

    // Funcion que se ejecuta cuando el controlador es llamado
    this.$onInit = function () {
        let tiempo = config.intervaloTarea * 1000;
        $scope.usuario = datos.usuario;
        // Consulta solicitudes con historial
        servicios.solicitudes.consultarHistorial(datos.usuario)
        .then((respuesta)=>{
            // Valida que la respuesta tenga datos validos
            if(servicios.validarRespuesta(respuesta)){
                $scope.solicitudes.historial = respuesta.data.data;
            }
        });
        // Consulta solicitudes pendientes
        servicios.solicitudes.consultarPendientes(datos.usuario)
        .then((respuesta)=>{
            // Valida que la respuesta tenga datos validos
            if(servicios.validarRespuesta(respuesta)){
                $scope.solicitudes.pendientes = respuesta.data.data;
            }
        })
        // Funcion que controla las actualizaciones de solicitudes en tiempo determinado
        tarea = setInterval(()=>{
            // Valida que si hay pendientes
            if($scope.solicitudes.pendientes.length){
                let obj = {
                    opcion:1,
                    servicio:'solicitudes',
                    usuario:datos.usuario,
                    edad:$scope.solicitudes.pendientes[0].num_edad,
                    tarjeta:$scope.solicitudes.pendientes[0].flg_tarjeta,
                    plazo:$scope.solicitudes.pendientes[0].num_plazo,
                    interes:$scope.solicitudes.pendientes[0].interes,
                    solicitado:$scope.solicitudes.pendientes[0].solicitado,
                    total:$scope.solicitudes.pendientes[0].total
                }
                // Actualiza la solicitud pendiente mas antigua
                servicios.solicitudes.actualizar(obj)
                    .then((respuesta)=>{
                        // Valida que la respuesta tenga datos validos
                        if(servicios.validarRespuesta(respuesta)){
                            // Consulta solicitudes con historial
                            servicios.solicitudes.consultarHistorial(datos.usuario)
                                .then((solicitudes)=>{
                                    // Valida que la respuesta tenga datos validos
                                    if(servicios.validarRespuesta(solicitudes)){
                                        $scope.solicitudes.historial = solicitudes.data.data;
                                    }else{
                                        $scope.solicitudes.historial = [];
                                    }
                                })
                            // Consulta solicitudes pendientes
                            servicios.solicitudes.consultarPendientes(datos.usuario)
                                .then((solicitudes)=>{
                                    // Valida que la respuesta tenga datos validos
                                    if(servicios.validarRespuesta(solicitudes)){
                                        $scope.solicitudes.pendientes = solicitudes.data.data;
                                    }else{
                                        $scope.solicitudes.pendientes = [];
                                    }
                                })
                        }
                    });
            }
        },tiempo)
    }

    // Funcion para inicializar una nueva solicitud
    var inicializarSolicitud = function(obj, test=false){
        if(!test){
            let radio1 = document.getElementById('radio1');
            let radio2 = document.getElementById('radio2');
            let radio3 = document.getElementById('radio3');
            if(radio1){
                radio1.checked=false;
            }
            if(radio2){
                radio2.checked=false;
            }
            if(radio3){
                radio3.checked=false;
            }
        }
        
        obj.edad = 0;
        obj.tarjeta = 0;
        obj.plazo = 0;
        obj.interes = 0;
        obj.solicitado = 0;
        obj.total = 0;
        return true;
    }

    // Funcion para asignar el plazo e interes en la nueva solicitud
    var setPlazoInteres = function(plazo,interes){
        $scope.nuevaSolicitud.plazo = plazo;
        $scope.nuevaSolicitud.interes = interes;
        return true;
    }

    // Funcion para asignar el plazo e interes en la nueva solicitud
    $scope.setPlazoInteres = function(plazo,interes){
        setPlazoInteres(plazo,interes);
    }

    // Evento clic para boton Nueva Solicitud
    // Muestra modal con un formulario para enviar nueva solicitud
    $scope.btnSolicitar = function(){
        inicializarSolicitud($scope.nuevaSolicitud);
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
            inicializarSolicitud($scope.nuevaSolicitud);
        }
    }

    // Evento clic para boton Enviar Solicitud
    // realiza validaciones sobre la edad y plazo
    // consume servicio para almacenar solicitud
    $scope.btnEnviarSolicitud = function(){
        // Valida edad
        if($scope.nuevaSolicitud.edad==0||$scope.nuevaSolicitud.edad>100){
            alert('Ingrese un numero valido para la edad');
            return false;
        }
        // Valida plazo
        if($scope.nuevaSolicitud.plazo==0){
            alert('Seleccione un plazo');
            return false;
        }

        // Registra la nueva solicitud
        servicios.solicitudes.registrar($scope.nuevaSolicitud)
            .then(()=>{
                // Consulta solicitudes pendientes para actualizar las solicitudes actuales
                servicios.solicitudes.consultarPendientes(datos.usuario)
                    .then((solicitudes)=>{
                        if(servicios.validarRespuesta(solicitudes)){
                            $scope.solicitudes.pendientes = solicitudes.data.data;
                        }
                    })
            })

        var modal = document.getElementById('myModal');
        modal.style.display = "none";
    }
});