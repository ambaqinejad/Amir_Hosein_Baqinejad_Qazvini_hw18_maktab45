$(document).ready(function() {
    $('#signUpForm').submit(function(e) {
        if ($('#password').val() !== $('#password2').val()) {
            $('#passwordError').text('Your passwords are not same.');
            return false;
        }
        return true;
    });
});