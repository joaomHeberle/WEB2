// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()


function mostraSenha(){
  var tipo = document.getElementById("password");
  if(tipo.type == "password"){
    tipo.type = "text";
  }else{
    tipo.type = "password";
  }
}

$(function() {
  $( "#calendario" ).datepicker({dateFormat: 'dd-mm-yy',
  changeMonth: true,
  changeYear: true,
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  showOtherMonths: true,
        selectOtherMonths: true,
        defaultDate: -10000
        

});
 
});
