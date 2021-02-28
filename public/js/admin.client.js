(function(){
	var editInput = document.getElementById('editInput');
  var evtName = document.getElementById('evtName');
  var delBtn = document.getElementById('delBtn');
  var updateBtn = document.getElementById('updateBtn');
  var deleteValue;
  var updateId;

  function evtVal(str,id) {
     editInput.value = str;
     updateId = id;
  }

  function delEventName(str,id) {
     evtName.innerHTML = str;
     deleteValue = id;
  }

  updateBtn.addEventListener('click',function(){
      var xhttp = new XMLHttpRequest();
      var url = "/auth/admin/types?id=" + updateId + "&name=" + editInput.value;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var toJson = JSON.parse(this.responseText)
          if(toJson.status){
              window.location.href = "/auth/admin/types";
          } else {
              alert(this.responseText.message)
          }
        }
      };
      xhttp.open("PUT",url, true);
      xhttp.send();
  },false)

  delBtn.addEventListener('click',function(){
      var xhttp = new XMLHttpRequest();
      var url = "/auth/admin/types?id=" + deleteValue;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var toJson = JSON.parse(this.responseText)
          if(toJson.status){
              window.location.href = "/auth/admin/types";
          } else {
              alert(this.responseText.message)
          }
        }
      };
      xhttp.open("DELETE",url, true);
      xhttp.send();
  },false)
})()