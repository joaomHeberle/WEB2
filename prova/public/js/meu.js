function confirmaAlert()
{
var x =confirm("Eu sou um alert!");
if(x){
    document.getElementById("confirmaDelete").click();
}else{
    document.getElementById("cancela").click();
}
}