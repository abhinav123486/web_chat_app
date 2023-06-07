var check, users, self_info;
var verify, chunks;
var loaded_chunks;
var cred_match;
var times = 0;
var changed = false;

const firebaseConfig = {
    apiKey: "AIzaSyBL432uDJTDwBqkirHOxv36Z5_M14x863M",
    authDomain: "web-chat-app-8dd62.firebaseapp.com",
    projectId: "web-chat-app-8dd62",
    storageBucket: "web-chat-app-8dd62.appspot.com",
    messagingSenderId: "507394045387",
    appId: "1:507394045387:web:c0d6d3625117aa204ff24e"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();

async function check_credentials() {
    // comparing user credentials
    const i = setInterval(() => {
      db.ref('/').child('user1').get().then((info) => {
        if (info.exists()) {
          db.ref('/').on('value', data => {
            var user_arr = ''
              var form_input_arr = data_avail? [id, password]: [form_input_id.value.trim(), form_input_password.value.trim()];
              cred_match = false;
                    
              for (var i in data.val()) {
                user_arr = [data.val()[i].id, data.val()[i].password];
                if (form_input_arr[0] == user_arr[0]) {
                  if (form_input_arr[1] == user_arr[1]) {
                    self_info = i;
                    cred_match = true;
                  }
                }
              }
              check = data.val();
          });
        } else {
          check = true;
          cred_match = false;
        }
      }).catch(err => console.log(err));
    }, 3500);
    return new Promise((res, rej) => {
      const interval = setInterval(() => {
        if (check) {
          res([cred_match, self_info]);
          clearInterval(i);
          loading.hidden = true;
          clearInterval(interval);
        }
      }, 1);
    });
}

function load() {
    check_credentials().then((res) => {
      console.log(res[0]);
      get_users(true, res[1]).then((user_arr) => {
        console.log(home_page_layout(user_arr));
          console.log(user_arr);
            if ("Notification" in window) {
              const icon = "images/favicon.ico";
                Notification.requestPermission().then(ev => {
                  if (ev === "granted") {
                    for (let chats in user_arr[user_arr.length-1][1].messages) {
                      var available = false;
                      db.ref(user_arr[user_arr.length-1][0]+'/'+'messages').get().then((data) => {
                        data.val() == ""? available = false: available = true;
                      });
                      const inter = setInterval(() => {
                        db.ref(user_arr[user_arr.length-1][0]+'/'+'messages'+'/'+chats).on('value', (chat) => {
                            if (times) {
                              var recent_chunk = "chunk"+Object.keys(chat.val()).length;
                              var recent_msg = "msg"+Object.keys(chat.val()[recent_chunk]).length;
                              var msg_data = chat.val()[recent_chunk][recent_msg];
    
                              if (msg_data.slice(msg_data.lastIndexOf('.')+1) == "in") {
                                if (current_chat != chats.split('_')[1]) {
                                  displayNotification(chats.split('_')[1], msg_data.slice(0, msg_data.lastIndexOf('.')));
                                }
                              }
                            }
                            times = 1;
                        });
                        if (available) {
                            clearInterval(inter);
                        }
                      }, 1000);
                    }
                  } else {
                    console.log("Notification permission was denied");
                  }
                }).catch(err => console.error(err))
            } else {
              throw new Error("Notification API is not suppoted in the browser");
            }
        });
    });
}

console.log(localStorage.length);
if (data_avail) {
    loading.removeAttribute('hidden');
    if (navigator.onLine) {
        load();
    } else {
        
        window.addEventListener('online', () => {
            load();
        });
        alert('Please turn your internet on');
    }
    form_submitted();
} else {
    loading.remove();
    form_bt.onclick = () => {
        if (navigator.onLine) {
          check_credentials().then((res) => {
            console.log(res[0]);
            if (res[0] == false) {
              db.ref('/').get().then((data) => {
                if (data.exists()) {
                  create_new_account();
                } else {
                  db.ref('user1/id').set(form_input_id.value.trim());
                  db.ref('user1/password').set(form_input_password.value.trim());
                  db.ref('user1/profile').set('');
                  db.ref('user1/messages').set('');
                }
              });
            }
            storeData();
            get_users(res[0], res[1]).then((user_arr) => {
              console.log(home_page_layout(user_arr));
              console.log(user_arr);
            });
            form_submitted();
          });
        } else {
          alert('Please turn your internet on');
        }
    }
}

function create_new_account() {
    db.ref('/').once('value', (data) => {
        var data_length = Object.entries(data.val()).length;
        db.ref('user'+(data_length+1)+'/'+'id').set(form_input_id.value.trim());
        db.ref('user'+(data_length+1)+'/'+'password').set(form_input_password.value.trim());
        db.ref('user'+(data_length+1)+'/'+'profile').set('');
        db.ref('user'+(data_length+1)+'/'+'messages').set('');
    });
}

function get_users(cred_match, self_info) {
    db.ref('/').child('user1').get().then((info) => {
        if (!cred_match) {
            if (info.exists()) {
                db.ref('/').once('value', (info) => {
                    users = Object.entries(info.val());
                });
            } else {
                users = [['user1', {id: form_input_id.value.trim(), password: form_input_password.value.trim(), profile: '', messages: ''}]];
            }
        } else {
            db.ref('/').once('value', (info) => {
                var temp_arr_self, temp_arr_last;
                const index_self = self_info.split('user')[1] - 1;
                temp_arr_self = Object.entries(info.val())[index_self];
                temp_arr_last = Object.entries(info.val())[Object.entries(info.val()).length-1];
                users = Object.entries(info.val());
                users[index_self] = temp_arr_last;
                users[Object.entries(info.val()).length-1] = temp_arr_self;
            });
        }
    });
    return new Promise((res, rej) => {
        const interval = setInterval(() => {
            if (users) {
                res(users);
                clearInterval(interval);
            }
        }, 1);
    });
}

function update_profile(canvas, id_self, type) {
    var percent_show = document.createElement('div');
    percent_show.setAttribute(
        'style',
        `position: absolute; background-color: aqua; margin-top: 78vh;
        margin-left: 30vw; width: 0; height: 1vw; z-index: ${x+4};`
    );
    document.body.appendChild(percent_show);
    var key = Math.random().toPrecision(21).toString().split('.')[1];

    if (type === 'upload_photo') {
        canvas.toBlob((blob) => {
            var upload = storage.ref('/').child(key).put(blob, {contentType: 'image/png'});
            upload.then((snap) => {
                db.ref(id_self+'/'+'profile').get().then((data) => {
                    const prev = data.val();
                    db.ref(id_self).update({'profile': key}, (err) => err? console.log(err): '');
                    console.log('uploaded successfully!!');
                    if (prev != "") {
                        storage.ref().child(prev).delete().catch((err) => {
                            console.log(err);
                        });
                    }
                    storage.ref(key).getDownloadURL().then((url) => {
                        settings_image.src = url;
                    });
                });
            }).catch((err) => {
                console.log(err);
            });
            upload.on('state_changed', (snap) => {
                var progress = (snap.bytesTransferred/snap.totalBytes)*100;
                percent_show.style.width = progress*4/10+'vw';
                if (progress == 100) {
                    setTimeout(() => {
                        percent_show.remove();
                    }, 400);
                }
            });
        }, 'image/png');
    }

    if (type === 'upload_file') {
        var file = upload_files.files[0];
        console.log(typeof(file));
        var upload = storage.ref('/').child(key).put(file, {contentType: file.type})
        upload.then((snap) => {
            db.ref(id_self+'/'+'profile').get().then((data) => {
                const prev = data.val();
                db.ref(id_self).update({'profile': key}, (err) => err? console.log(err): '');
                console.log('uploaded successfully!!');
                if (prev != "") {
                    storage.ref().child(prev).delete().catch((err) => {
                        console.log(err);
                    });
                }
                storage.ref(key).getDownloadURL().then((url) => {
                    settings_image.src = url;
                });
            });
        }).catch((err) => {
            console.log(err);
        });
        upload.on('state_changed', (snap) => {
            var progress = (snap.bytesTransferred/snap.totalBytes)*100;
            percent_show.style.width = progress*4/10+'vw';
            if (progress == 100) {
                const tm = setTimeout(() => {
                    percent_show.remove();
                    clearTimeout(tm);
                }, 400);
            }
        });
    }
}

function retrieve_profile(clients) {
    var c = [...clients];
    var d = c.pop();
    c.forEach((val, index) => {
        var prof = val[1].profile;
        if (prof != "") {
            storage.ref(prof).getDownloadURL().then((url) => {
                profile[index].style.backgroundImage = `url(${url})`;
            });
        }
    });
    if (d[1].profile != "") {
        storage.ref(d[1].profile).getDownloadURL().then((url) => {
            settings_image.src = url;
        });
    }
}

function delete_profile(self_info) {
    db.ref(self_info[0]+'/'+'profile').get().then((data) => {
        if (data.val() != "") {
            storage.ref(data.val()).delete().then(() => {
                db.ref(self_info[0]).update({profile: ""});
                settings_image.src = 'images/default_profile.webp';
            }).catch((err) => {
                console.log(err);
            });
        }
    });
}

function update_chat_profile(ref_client) {
    if (ref_client[1].profile != "") {
        storage.ref(ref_client[1].profile).getDownloadURL().then((url) => {
            chat_profile_img.src = url;
        });
    }
}

function update_msg(ref_client, self, msg) {
    db.ref(self[0]+'/'+'messages'+'/'+self[1].id+'_'+ref_client[1].id).get().then((data) => {
        if (data.exists()) {
            var chunk = Object.entries(data.val()).length;
            var msg_num = Object.entries(data.val()['chunk'+chunk]).length;
            var current_chunk = msg_num==9?chunk+1:chunk;
            db.ref(self[0]+'/'+'messages'+'/'+self[1].id+'_'+ref_client[1].id+'/'+'chunk'+current_chunk+'/'+'msg'+(msg_num==9?1:msg_num+1)).set(msg+'.'+'out');
            db.ref(ref_client[0]+'/'+'messages'+'/'+ref_client[1].id+'_'+self[1].id+'/'+'chunk'+current_chunk+'/'+'msg'+(msg_num==9?1:msg_num+1)).set(msg+'.'+'in');
        } else {
            db.ref(self[0]+'/'+'messages'+'/'+self[1].id+'_'+ref_client[1].id+'/'+'chunk1'+'/'+'msg1').set(msg+'.'+'out');
            db.ref(ref_client[0]+'/'+'messages'+'/'+ref_client[1].id+'_'+self[1].id+'/'+'chunk1'+'/'+'msg1').set(msg+'.'+'in');
        }
    });
}

function retrieve_msg(ref_client, self) {
    db.ref(self[0]+'/'+'messages'+'/'+self[1].id+'_'+ref_client[1].id).on('value', (data) => {
        if (data.val()) {
            changed = true;
            chunks = Object.entries(data.val());
            loaded_chunks = [];
            chunks.forEach(value => {
                Object.entries(value[1]).forEach(val => {
                    for (var i = 1; i < val.length; i += 2) {
                        loaded_chunks.push(val[i]);
                    }
                });
            });
            if (!back_icon.hidden) {
                display_chat(loaded_chunks);
            }
        }
        stats = true;
    });
}

/**var t;
db.ref('user1/id').on('value', data => {
    t = data.val();
});
var interval = setInterval(() => {
    if (t != undefined) {
       // console.log(t);
        clearInterval(interval);
    }
}, 1);
*/

/**db.ref('id').on('value', (data) => {
    console.log(data.val());
});
db.ref('id1').remove();

const key = db.ref('/').push({'id': true});
console.log(key.key);
*/
