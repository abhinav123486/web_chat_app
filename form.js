/** form elements */
const form_heading = document.getElementById('login');
const form_bt = document.getElementById('form_bt');
const form_input_id = document.getElementById('form_input1');
const form_input_password = document.getElementById('form_input2');
const form_id_txt = document.getElementById('form_id');
const form_password_txt = document.getElementById('form_password');
const loading = document.getElementById('loading_icon');

function form_submitted() {
    form_heading.remove();
    form_bt.remove();
    form_input_id.remove();
    form_input_password.remove();
    form_id_txt.remove();
    form_password_txt.remove();
    document.body.style.backgroundImage = "url(images/bg1.png)";
}