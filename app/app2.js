const path = require('path');
const os = require('os');
const fs = require('fs');
const {
    ipcRenderer
} = require('electron');

const yaml = require('js-yaml');

const customTitlebar = require('custom-electron-titlebar');

let titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#bca4a4'),
    icon: '../icons/molecule.png',
    unfocusEffect: false,
    titleHorizontalAlignment: 'left'
});


const form = document.getElementById("image-form");
const result = document.querySelector(".output");
let img = document.createElement('img');
let p = document.createElement('p');
let table = document.createElement('table');

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.datepicker');
    let options = {
        format: 'yyyy-mm-dd',
        autoClose: true,
        onClose: function () {
            console.log(document.querySelectorAll('.datepicker')[0].value);

        };

    };
    let instances = M.Datepicker.init(elems, options);

});


document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.timepicker');
    let option = {
        format: 'HH:mm:ss',
        autoClose: true,
    };
    let instances = M.Timepicker.init(elems, option);
});


let dir = os.homedir() + "/Molecule/CRs";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
} else {
    console.log("Dir exist")
};

fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err);
    };
    for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
            if (err) {
                console.log(err);
            };
        });
    };
});


function text() {

    let csv1 = document.getElementById('csv');
    const selected = document.querySelector(".validate");
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);
    selected.value = name;

    fs.copyFile('\\\\u\\path\\to\\PythonScripts\\build.exe', dir + "\\" + "build.exe", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });

    fs.copyFile('\\\\u\\path\\to\\PythonScripts\\Network.exe', dir + "\\" + "Network.exe", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });

    fs.copyFile('\\\\u\\path\\to\\L1_Team\\Selenium Automation\\chromedriver.exe', dir + "\\" + "chromedriver.exe", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });
};

form.addEventListener('submit', (e) => {

    let isChecked = document.querySelector("#myswitch").checked;

    let submit = document.getElementById('submit');
    submit.disabled = true;
    let inputs1 = document.getElementById('email_inline');
    let textareas = document.querySelectorAll('.datepicker')[0];
    let textareas1 = document.querySelectorAll('.timepicker')[0];
    let csv1 = document.getElementById('csv');
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);
    fs.copyFile(filepath, dir + "\\" + name, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });


    if (result.childElementCount > 0) {
        try {

            table.innerHTML = ""
            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.innerHTML = ""


        } catch (e) {

        }

    };


    img.src = "Molecule.gif";
    img.className = 'chemical';
    p.textContent = "It's brewing...!!";

    result.appendChild(img);
    result.appendChild(p);


    let time = [];
    time = document.querySelectorAll('.timepicker')[0].value.split(" ");

    fs.writeFileSync(dir + "/" + "value.txt", document.querySelectorAll('.datepicker')[0].value + " " + document.getElementById("email_inline").value + " " + time[0] + ":00" + " " + time[1]);

    ipcRenderer.send('Python', {
        isChecked
    });

    e.preventDefault();

});

ipcRenderer.on('python:done', (e, logs) => {

    let csv1 = document.getElementById('csv');
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);

    fs.unlinkSync(dir + "/" + "build.exe");

    fs.unlinkSync(dir + "/" + "Network.exe");

    fs.unlinkSync(dir + "/" + "chromedriver.exe");

    fs.unlinkSync(dir + "/" + name);

    fs.unlinkSync(dir + "/" + "value.txt");

    if (result.childElementCount > 0) {

        table.innerHTML = "";
        result.removeChild(img);
        result.removeChild(p);
        p.innerHTML = "";
        img.innerHTML = "";

    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the CRs raised in outlook folder after few mins and rerun with CSV for which aren't completed.";

        result.appendChild(p);

    } else {
        let th1 = document.createElement('th');
        th1.appendChild(document.createTextNode('CR Output'));
        let out = fs.readFileSync(dir + "/" + "changeraised.txt", 'utf8');
        let array = out.split("\\n");
        let ty = [];
        for (i = 0; i < array.length; i++) {
            ty[i] = document.createElement('tr');
            ty[i].appendChild(document.createTextNode(array[i]));
            th1.appendChild(ty[i]);

        };

        if (result.childElementCount > 0) {


            table.innerHTML = "";
            result.removeChild(img);
            result.removeChild(p);
            p.innerHTML = "";
            img.innerHTML = "";


        table.appendChild(th1);
        result.appendChild(table);

    };


});