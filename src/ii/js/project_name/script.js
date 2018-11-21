document.addEventListener('DOMContentLoaded', function(){ // Аналог $(document).ready(function(){
  console.log('Hello!')

  // Если должен быть найден один элемент
  if((e = document.querySelectorAll("#form_error_message_frontend + div > div:last-child label")) !== null)
    e.classList.add('last'); // Аналог выборки и присвоения класса
  // Если элементов будет много
  Array.prototype.forEach.call(document.querySelectorAll("#form_error_message_frontend + div > div:last-child label"), function(e){
   e.classList.add('last');
  });
});