const path = require('path');
const os = require('os');
const fs = require('fs');
const {
    ipcRenderer
} = require('electron');

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);

});

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});


const form = document.getElementById("image-form");
const result = document.querySelector(".output");
let img = document.createElement('img');
let p = document.createElement('p');
let table = document.createElement('table');



let dir = os.homedir() + "/Molecule/Crusher";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
} else {
    console.log("Dir exist");
}

fs.readdir(dir, (err, files) => {

    for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
            if (err) {
                console.log(err);
            };
        });
    };
});

function text1() {

    let csv1 = document.getElementById('csv1');
    const selected = document.querySelector(".validate");
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);
    selected.value = name;

    if (result.childElementCount > 0) {

        table.innerHTML = "";
        result.removeChild(img);
        result.removeChild(p);
        p.innerHTML = "";
        img.innerHTML = "";

    }
;
    fs.copyFile('\\\\path\\to\\Closer.exe', dir + "\\" + "Closer.exe", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });


    fs.copyFile('\\\\path\\to\\repo\\L1_Team\\Selenium Automation\\chromedriver.exe', dir + "\\" + "chromedriver.exe", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successful");
        };
    });


}


form.addEventListener('submit', (e) => {

    e.preventDefault();

    let submit = document.getElementById('submit');
    submit.disabled = true;


    let inputs = document.getElementById('csv1');
    let csv1 = document.getElementById('csv1');
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
            console.log(e);
        };

    };


    img.src = "Molecule.gif";
    img.className = 'chemical';
    p.textContent = "Flashing....!! Please standby.";

    result.appendChild(img);
    result.appendChild(p);
    let e = document.getElementsByClassName("browser-default")[0];
    let strUser = e.options[e.selectedIndex].value;

    fs.writeFileSync(dir + "/" + "value.txt", strUser);

    ipcRenderer.send('Crusher');


});

ipcRenderer.on('Crushed', (e, logs) => {


    let csv1 = document.getElementById('csv1');
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);

    fs.unlinkSync(dir + "/" + name);

    fs.unlinkSync(dir + "/" + "value.txt")

    fs.unlinkSync(dir + "/" + "Closer.exe")
    fs.unlinkSync(dir + "/" + "chromedriver.exe")


    if (result.childElementCount > 0) {
        result.removeChild(img)
        result.removeChild(p)
        p.innerHTML = ""
        img.innerHTML = ""



    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the excel attached and also verify if any CRs are already closed in process";

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