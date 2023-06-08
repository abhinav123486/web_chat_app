var names_show = [];
var box = [];
var profile = [];
var bubbles = [];
var x, cross, msg;
var vid, ref_client;
var stats;
var current_chat;
var scr_w = window.innerWidth;
var scr_h = window.innerHeight;
const width_percent = 2.6;
var profile_h = (width_percent*scr_w)/scr_h;
const cross_w = 2;
const cross_h = (cross_w*scr_w)/scr_h;
const chat_heading = document.getElementById('chat');
const setting_icon = document.getElementById('settings');
const back_icon = document.getElementById('back_icon');
const send_icon = document.getElementById('send_icon');
const msg_input = document.getElementById('msg_input');
const chat_id = document.getElementById('chat_id');
const container = document.getElementById('container-settings');
const take_photo = document.getElementById('take_photo');
const upload_files = document.getElementById('upload_files');
const settings_heading = document.getElementById('settings_bar');
const settings_image = document.getElementById('settings_image');
const take_photo_icon = document.getElementById('take_photo_icon');
const chat_profile_img = document.getElementById('chat_profile_img');
const delete_icon = document.getElementById('delete_profile');
const logout = document.getElementById('logout');
const msg_container = document.getElementById('container-msg');

function home_page_layout(clients) {
    cross = document.createElement('img');

    for (x = 0; x < clients.length-1; x++) {
        var margin = x*5+10;
    
        names_show.push(document.createElement('p'));
        document.body.append(names_show[x]);

        box.push(document.createElement('div'));
        box[x].setAttribute(
        'style', 
        `border: 2px solid black;
        width: 95%; padding-top: 1%;
        margin-top: ${margin}%; padding-bottom: 2%;
        border-radius: 30px; position: absolute;
        background-color: yellow; opacity: 0.6;`
        );
        document.body.append(box[x]);

        profile.push(document.createElement('span'));
        profile[x].setAttribute(
            'style', 
            `position:absolute;border-radius: 50%; margin-top: ${margin+0.205}%;
            width: ${width_percent}vw; height: ${profile_h}vh; margin-left: 0.23%;
            border: 2px solid black; background-image: url(images/default_profile.webp);
            background-repeat: no-repeat; background-size: 100% 100%;`
        );
        document.body.append(profile[x]);

        var styles_p = names_show[x];
        styles_p.innerHTML = clients[x][1].id;
        styles_p.style.position = 'absolute';
        styles_p.style.margin = `${margin}% 6%`;
        styles_p.style.fontSize = '40px';
        styles_p.style.color = 'white';
        styles_p.style.fontStyle = 'bold';
    }

    names_show.forEach((names) => {
        names.style.zIndex = x+1;
    });

    //setting attributes
    cross.setAttribute(
        'style',
        `position: absolute; margin-top: 0.5%;  margin-left: 97%;
        width: ${cross_w}%; height: ${cross_h}%; z-index:${x+3}; cursor: pointer;`
    );
    container.setAttribute(
        'style',
        `position: fixed; width: 102vw; height: 102vh;
        background-color: white; z-index: ${x+2}; margin-top: -2vh;
        margin-left: -2vw;`
    );
    msg_container.setAttribute(
        'style',
        `position: fixed; width: 101.5vw; height: ${87-profile_h*2*1.5}vh;
        background-color: white; z-index: ${x+3}; margin-top: ${profile_h*2*1.5}vh;
        margin-left: -2vw;`
    );
    settings_heading.setAttribute(
        'style',
        `z-index: ${x+3};`
    );
    back_icon.setAttribute(
        'style',
        `z-index: ${x+6}; width: ${width_percent}vw; height: ${profile_h}vh;`
    );
    take_photo.setAttribute(
        'style',
        `z-index: ${x+3};`
    );
    upload_files.setAttribute(
        'style',
        `z-index: ${x+3};`
    );
    msg_input.setAttribute(
        'style',
        `z-index: ${x+6}; height: ${scr_h*1/20}px; width: ${scr_w-1/5*scr_w}px;
        margin: ${(9/10)*scr_h}px ${(1/20)*scr_w}px;`
    );
    delete_icon.setAttribute(
        'style',
        `z-index: ${x+3};`
    );
    settings_image.setAttribute(
        'style',
        `z-index: ${x+3};`
    );
    chat_profile_img.setAttribute(
        'style',
        `z-index: ${x+6}; width: ${width_percent*2}vw; height: ${profile_h*2}vh;`
    );
    chat_id.setAttribute(
        'style',
        `z-index: ${x+6};`
    );
    send_icon.setAttribute(
        'style',
        `z-index: ${x+6}; width: ${width_percent}vw; height: ${profile_h}vh;`
    );
    take_photo_icon.setAttribute(
        'style',
        `z-index: ${x+5};`
    );
    logout.setAttribute(
        'style',
        `z-index: ${x+3};`
    );

    cross.src = 'images/cross.png';
    cross.setAttribute('hidden', 'true');
    document.body.append(cross);

    window.addEventListener('resize', () => {
        scr_w = window.innerWidth;
        scr_h = window.innerHeight;
        profile_h = (width_percent*scr_w)/scr_h;

        profile.forEach((val) => {
            val.style.width = `${width_percent}vw`;
            val.style.height = `${profile_h}vh`;
        });
        chat_profile_img.style.width = `${width_percent*2}vw`;
        chat_profile_img.style.height = `${profile_h*2}vh`;
        back_icon.style.width = `${width_percent}vw`;
        back_icon.style.height = `${profile_h}vh`;
        send_icon.style.width = `${width_percent}vw`;
        send_icon.style.height = `${profile_h}vh`;
    });

    cross.onclick = () => {
        cross.hidden = true;
        container.hidden = true;
        settings_heading.hidden = true;
        take_photo.hidden = true;
        upload_files.hidden = true;
        settings_image.hidden = true;
        delete_icon.hidden = true;
        logout.hidden = true;
    }

    back_icon.onclick = () => {
        back_icon.hidden = true;
        chat_profile_img.hidden = true;
        container.hidden = true;
        send_icon.hidden = true;
        msg_input.hidden = true;
        chat_id.hidden = true;
        msg_container.hidden = true;
        current_chat = null;
        bubbles.forEach(val => val.remove());
        bubbles = [];
    }

    box.forEach((elem, index) => {
        elem.addEventListener('mouseenter', () => {
            elem.style.backgroundColor = 'pink';
        });
        elem.addEventListener('mouseleave', () => {
            elem.style.backgroundColor = 'yellow';
        });
        elem.addEventListener('click', () => {
            ref_client = clients[index];
            stats = false;

            msg_interface(ref_client);
            retrieve_msg(ref_client, clients[clients.length-1]);
        });
    });

    send_icon.onclick = () => {
        msg = msg_input.value.trim();
        msg_input.value = "";
        update_msg(ref_client, clients[clients.length-1], msg);
    }

    take_photo.onclick = () => {
        photo_interface(clients[clients.length-1][0]);
    }

    upload_files.onchange = () => {
        file_interface(clients[clients.length-1][0]);
    }

    delete_icon.onclick = () => {
        delete_profile(clients[clients.length-1]);
    }

    logout.onclick = () => {
        removeData();
        location.reload();
    }

    retrieve_profile(clients);

    loading.remove();
    chat_heading.removeAttribute('hidden');
    setting_icon.removeAttribute('hidden');
    setting_icon.addEventListener('click', () => {
        cross.removeAttribute('hidden');
        container.removeAttribute('hidden');
        settings_heading.removeAttribute('hidden');
        take_photo.removeAttribute('hidden');
        upload_files.removeAttribute('hidden');
        settings_image.removeAttribute('hidden');
        delete_icon.removeAttribute('hidden');
        logout.removeAttribute('hidden');
    });
    return names_show;
}

async function photo_interface(self_id) {
    var profile_cross = document.createElement('img');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var vid = document.createElement('video');
    var w = screen.width;
    var h = screen.height;

    vid.setAttribute(
      'style',
      `z-index: ${x+4}; position: absolute; top: 0; left: 0;
      width: 100%; height: 100%; object-fit: contain; margin: 0; padding: 0;`
    );
    canvas.setAttribute(
      'style',
      `z-index: ${x+4}; position: absolute;
      top: 0; left: 0; margin: 0; padding: 0;
      width: 100vw; height: 100vh;`
    );
  
    document.body.append(vid);
    document.body.append(canvas);
    document.body.append(profile_cross);
  
    await navigator.mediaDevices.getUserMedia({
        video: { width: w > h? w: h, height: h < w? h: w, frameRate: 60 },
        audio: false,
    }).then((stream) => {
    vid.srcObject = stream;
    vid.autoplay = true;

    take_photo_icon.removeAttribute('hidden');
  
    vid.addEventListener('loadedmetadata', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        profile_cross.src = 'images/cross.png';
        profile_cross.setAttribute(
            'style',
            `z-index: ${x+5}; position: absolute; margin-left: 96.5vw; margin-top: 0.5vw;
            width: ${cross_w}vw; height: ${cross_h}vh; cursor: pointer;`
        );
    });

    take_photo_icon.onclick = () => {
        update_profile(canvas, self_id, 'upload_photo');
        profile_cross.setAttribute('hidden', 'true');
        canvas.remove();
        vid.remove();
        take_photo_icon.setAttribute('hidden', 'true');
    }

    profile_cross.onclick = () => {
        profile_cross.setAttribute('hidden', 'true');
        canvas.remove();
        vid.remove();
        take_photo_icon.setAttribute('hidden', 'true');
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
  
    function draw() {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(vid, -window.innerWidth, 0, window.innerWidth, window.innerHeight);
        ctx.restore();
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    });
}

function file_interface(self_id) {
    update_profile('', self_id, 'upload_file');
}

function msg_interface(ref_client) {
    chat_profile_img.removeAttribute('hidden');
    container.removeAttribute('hidden');
    back_icon.removeAttribute('hidden');
    send_icon.removeAttribute('hidden');
    msg_input.removeAttribute('hidden');
    chat_id.removeAttribute('hidden');
    msg_container.removeAttribute('hidden');
    current_chat = ref_client[1].id;
    chat_id.innerHTML = current_chat;

    update_chat_profile(ref_client);
}

function display_chat(loaded_chunks) {
    var spl_info_txt = [...loaded_chunks];
    var txt_list = [];
    var previous = 0;

    spl_info_txt.forEach((val, index) => {
        var arr_txt = val.split(' ');
        var last_index = arr_txt[arr_txt.length-1].lastIndexOf('.');
        var last = arr_txt[arr_txt.length-1].slice(0, last_index);
        arr_txt.pop();
        arr_txt.push(last);
    
        var final_txt = arr_txt.join(' ');
        txt_list.push(final_txt);

        var outerDiv = document.createElement('div');
        var innerDiv = document.createElement('div');
            
        msg_container.append(outerDiv);
        outerDiv.append(innerDiv);
        outerDiv.style.backgroundColor = 'coral';
        outerDiv.style.position = 'absolute';
        outerDiv.style.borderRadius = '5px';
        innerDiv.innerHTML = final_txt;
        innerDiv.style.fontSize = 'x-large';
        var r = innerDiv.scrollWidth/document.documentElement.clientWidth*100;
        var type = val.slice(val.lastIndexOf('.')+1);
        if (type == 'in') {
            outerDiv.style.marginLeft = '5vw';
            outerDiv.style.marginRight = '50vw';
        } else {
            outerDiv.style.marginLeft = r < 45? 95.3-r+'vw': '50vw';
            outerDiv.style.marginRight = '5vw';
        }
        r > 45? innerDiv.style.wordBreak = 'break-word': innerDiv.style.wordBreak = 'keep-all';
        outerDiv.style.marginTop = previous+'vh';
        bubbles.push(outerDiv);

        previous += (innerDiv.scrollHeight/window.innerHeight)*100+2;
    });
}
