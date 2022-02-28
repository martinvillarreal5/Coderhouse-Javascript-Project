$(document).ready(function () {
  $("#register-form").submit(function (event) {
    event.preventDefault();

    let passwordValue = $("#register-form__password").val();
    let usernameValue = $("#register-form__username").val();
    let emailValue = $("#register-form__email").val();

    if(users.find(user => user.username == usernameValue)){
      alert("This username is already taken");
      return;
    } else if(users.find(user => user.email == emailValue)){
      alert("This email is already taken");
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
          Swal.fire({
            title: 'Registration Succesful',
            text: ` 
            Created at: ${response.createdAt}  
            `,
            /* Username: ${response.username}
            Email: ${response.email} 
            Id: ${response.id} */
            icon: 'success',
            confirmButtonText: 'Continue'
          }).then( () => {
          window.location.href = "../../";
          })
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
