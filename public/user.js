let oldUsername, newUsername, oldPassword, password, password2;
$(document).ready(function() {
    oldUsername = $('#oldUsername');
    newUsername = $('#newUsername');
    oldPassword = $('#oldPassword');
    password = $('#password');
    password2 = $('#password2');

    $('#updateForm').submit(function(e) {
        if (!oldUsername.val() || !oldPassword.val() ||
            !newUsername.val() || !password.val() ||
            !password2.val()) {
            $('#updateError').text('Some fields are empty.');
            return false;
        }
        if (password.val() !== password2.val()) {
            $('#updateError').text('Your password and it\'s retype are not same.');
            return false;
        }
        if (oldUsername.val().length < 3 || oldUsername.val().length > 20 ||
            newUsername.val().length < 3 || newUsername.val().length > 20 ||
            oldPassword.val().length < 4 || oldPassword.val().length > 20 ||
            password.val().length < 4 || password.val().length > 20) {
            $('#updateError').text("Username or Password is unsatisfied.");
            return false;
        }
        return true;
    });
});