function myfun(id) {
  console.log(id);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("form").innerHTML = this.responseText;
    }
  };
  xhttp.open("DELETE", "", true);
  xhttp.send();
}
