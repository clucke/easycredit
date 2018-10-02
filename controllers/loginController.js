app.controller('loginController', function($scope, $location,datos, servicios) {
    // Funcion que controla el evento click del boton aceptar
    $scope.btnAceptar = () => {
        datos.usuario = document.getElementById('usuario').value;
        if(datos.usuario!=''){
           servicios.usuarios.registrar(datos.usuario)
                .then(()=>{
                   $location.path('/home');
                }).catch((error)=>{
                    alert('Error al conectarse al servicio, intente mas tarde');
                })
        }else{
            alert('Ingrese su nombre');
        } 
    };
});