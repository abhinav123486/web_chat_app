const lCache = localStorage;
var data_avail;
var id = lCache.getItem('id');
var password = lCache.getItem('password');

if (id !== null && password !== null) {
    data_avail = true;
} else {
    data_avail = false;
}

function storeData() {
    lCache.setItem('id', form_input_id.value.trim());
    lCache.setItem('password', form_input_password.value.trim());
    var i = lCache.getItem('id');
    var p = lCache.getItem('password');
    console.log('id:', i, ',', 'password:', p);
}

function removeData() {
    lCache.removeItem('id');
    lCache.removeItem('password');
}