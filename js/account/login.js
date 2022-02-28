$(document).ready(function () {
  $("#login-form").submit(function (event) {
    event.preventDefault();
    
    let usernameValue = $("#login-form__username").val();
    let passwordValue = $("#login-form__password").val();

    $.ajax({
      url: "https://www.onlinetool.in/fake-rest-api/api/login/",
      type: "POST",
      data: {
        username: usernameValue,
        password: passwordValue,
      },
      success: function (response) {
        alert(`Login Succesful:
            Username: ${usernameValue}
            Token: ${response.token}  
            `);
        window.location.href = "../../";
      },
    });
  });
});
