console.log('aaaaaaaaaaaaaa');
$(document).ready(function() {
    $('#signUpForm').submit(function(e) {
        console.log($('#password').val());
        console.log($('#password2').val());
        if ($('#password').val() !== $('#password2').val()) {
            $('#passwordError').text('Your passwords are not same.');
            return false;
        }
        return true;
    });
});