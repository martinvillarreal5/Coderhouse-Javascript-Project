//validaciones por defecto de html no siempre funcionan si se usa un dato de cuenta guardado

$(document).ready(function () {
  //submit
  $("#register-form").submit(function (event) {
    event.preventDefault();

    let passwordValue = $("#register-form__password").val();
    let usernameValue = $("#register-form__username").val();
    let emailValue = $("#register-form__email").val();

    if(users.find(user => user.username == usernameValue)){
      alert("El usuario ya existe");
      return;
    }

    $.ajax({
      url: "https://reqres.in/api/users",
      type: "POST",
      data: {
        "username": usernameValue,
        "email": emailValue,
        "password": passwordValue
        
      },
      success: function(response){
          console.log(response);
          users.push(new User(
            response.id,
            response.username,
            response.email,
            response.password
          ))
          localStorage.setItem("users", JSON.stringify(users));
          alert(`Registration Succesfull:
          Username: ${response.username}
          Email: ${response.email}
          Id: ${response.id}
          Created at: ${response.createdAt}  
          `);
          window.location.href = "../../index.html";
      }
    });
  });
});

class User {
  constructor(id, username, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

const users = JSON.parse(localStorage.getItem("users")) || [];
