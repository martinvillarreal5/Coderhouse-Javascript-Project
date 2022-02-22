$(document).ready(function () {
    
  // Validate Username
  $("#usercheck").hide();
  let usernameError = true;
  $("#register-form__username").keyup(function () {
    validateUsername();
  });

  function validateUsername() {
    let usernameValue = $("#register-form__username").val();
    if (usernameValue.length == "") {
      $("#usercheck").show();
      $("#usercheck").html("**Username is missing");
      usernameError = false;
      return false;
    } else if (usernameValue.length < 3 || usernameValue.length > 10) {
      $("#usercheck").show();
      $("#usercheck").html("**length of username must be between 3 and 20");

      usernameError = false;
      return false;
    } else {
      $("#usercheck").hide();
    }
  }
  // Validate Password
  $("#passcheck").hide();
  let passwordError = false;
  $("#register-form__password").keyup(function () {
    validatePassword();
  });
  function validatePassword() {
    let passwordValue = $("#register-form__password").val();
    if (passwordValue.length == "") {
      $("#passcheck").show();
      $("#passcheck").html("**Password is missing");
      passwordError = true;
      return true;
    }
    if (passwordValue.length < 8 || passwordValue.length > 20) {
      $("#passcheck").show();
      $("#passcheck").html(
        "**length of your password must be between 8 and 20 characters"
      );
      passwordError = true;
      return true;
      }
  }
  // Validate Password
  $("#passcheck").hide();
  let passwordError = false;
  $("#register-form__password").keyup(function () {
    validatePassword();
  });
  function validatePassword() {
    let passwordValue = $("#register-form__password").val();
    
    if (passwordValue.match(/^[0-9A-Za-z]+$/) === null){ 
      //is not alphanumeric
      $("#passcheck").show();
      $("#passcheck").html("**password must contain alphanumeric characters only");
      return true;
    }else {
      $("#passcheck").hide();
      return false;
    }
  }
});