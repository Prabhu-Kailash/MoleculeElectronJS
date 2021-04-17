const {
    ipcRenderer
} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

const customTitlebar = require('custom-electron-titlebar');

let titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2C1E42'),
    icon: '../icons/molecule.png',
    unfocusEffect: false,
    titleHorizontalAlignment: 'left'
});

let dir = os.homedir() + "/Molecule/PostOffice";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
} else {
    console.log("Dir exist");
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

fs.copyFile('\\\\path\\to\\PostMan.exe', dir + "\\" + "PostMan.exe", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successful");
    };
});



const form = document.getElementById("image-form");
const result = document.querySelector(".output");
let table = document.createElement('table');
let img = document.createElement('img');
let p = document.createElement('p');

function text1() {
    let csv1 = document.getElementById('csv1');
    let selected = document.querySelector(".validate");
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);
    selected.value = name;

}

function text2() {
    let csv2 = document.getElementById('csv2');
    let selected = document.querySelectorAll(".validate")[1];
    let filepath = csv2.files[0].path;
    let name = path.basename(filepath);
    selected.value = name;

}

form.addEventListener('submit', e => {

    let csv1 = document.getElementById('csv1');
    let csv2 = document.getElementById('csv2');
    let prodpath = csv1.files[0].path;
    let preprodpath = csv2.files[0].path;

    fs.copyFile(prodpath, dir + "\\" + "Prod.csv", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        };
    });

    fs.copyFile(preprodpath, dir + "\\" + "PreProd.csv", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });

    ipcRenderer.send('PostMan');

    img.src = "Molecule.gif";
    p.textContent = "It will just take few seconds. Please standby!";
    result.appendChild(img);
    result.appendChild(p);
    e.preventDefault();

});


ipcRenderer.on('PostOffice', (e, logs) => {

    fs.unlinkSync(dir + "/" + "Prod.csv");
    fs.unlinkSync(dir + "/" + "PreProd.csv");
    fs.unlinkSync(dir + "/" + "PostMan.exe");

    if (result.childElementCount > 0) {

        result.removeChild(img);
        result.removeChild(p);
        p.innerHTML = "";
        img.innerHTML = "";

    };

    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the files selected.";

        result.appendChild(p);

    } else {

        if (logs.data == "Empty DataFrame Columns: [Mailbox, Producer] Index: []") {
            p.textContent = "Vola!Check your draft";
        } else {

            p.textContent = logs.data;

        }
        result.appendChild(p);

    };
});