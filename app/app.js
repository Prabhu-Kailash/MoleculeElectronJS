const {
    ipcRenderer
} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

const customTitlebar = require('custom-electron-titlebar');

let titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#ffffff'),
    icon: '../icons/molecule.png',
    unfocusEffect: false,
    titleHorizontalAlignment: 'left'
});


const form = document.getElementById("image-form");
const result = document.querySelector(".output");
let table = document.createElement('table');
let img = document.createElement('img');
let h3 = document.createElement('p');


form.addEventListener('submit', e => {

    let csv1 = document.getElementById('csv');
    let filepath = csv1.files[0].path;
    let radio = document.querySelector('input[name=environment]:checked').value;

    ipcRenderer.send('JSON:Data', {
        filepath,
        radio
    });
    e.preventDefault();

});

function text() {
    let csv1 = document.getElementById('csv');
    const selected = document.querySelector(".validate");
    let filepath = csv1.files[0].path;
    let name = path.basename(filepath);
    selected.value = name;
    table.innerHTML = "";
    if (img.className == "pikachu" || h3.className == "result-tag") {
        result.removeChild(img);
        result.removeChild(h3);
        h3.innerHTML = "";
        img.className = "";
        h3.className = "";
    };
};

ipcRenderer.on('complete', (e, data) => {

    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    let th4 = document.createElement('th');
    let th5 = document.createElement('th');
    let th6 = document.createElement('th');
    let th7 = document.createElement('th');
    let th8 = document.createElement('th');
    let th9 = document.createElement('th');
    let th10 = document.createElement('th');
    let th11 = document.createElement('th');
    let th12 = document.createElement('th');

    th1.appendChild(document.createTextNode('SpacesFound'));
    th2.appendChild(document.createTextNode('InvalidEmailAddresses'));
    th3.appendChild(document.createTextNode('CheckFileRename'));
    th4.appendChild(document.createTextNode('ProducerConfiguration'));
    th5.appendChild(document.createTextNode('MultipleDestinationConsumer'));
    th6.appendChild(document.createTextNode('MailboxAlreadyExist'));
    th7.appendChild(document.createTextNode('CommunityNotFound'));
    th8.appendChild(document.createTextNode('WeakPassword'));
    th9.appendChild(document.createTextNode('VerifyDeliveryPath'));
    th10.appendChild(document.createTextNode('InvalidRC'));
    th11.appendChild(document.createTextNode('MaxCharExceeded'));
    th12.appendChild(document.createTextNode('CaseSensitive'));


    let i = 0;

    if (data.error.MaxCharExceeded.length > 0) {

        let ta = [];

        for (i = 0; i < data.error.MaxCharExceeded.length; i++) {
            ta[i] = document.createElement('tr');
            ta[i].appendChild(document.createTextNode(data.error.MaxCharExceeded[i]));
            th11.appendChild(ta[i]);
        };

        table.appendChild(th11);


    };

    if (data.error.CaseSensitive.length > 0) {

        let ti = [];

        for (i = 0; i < data.error.CaseSensitive.length; i++) {
            ti[i] = document.createElement('tr');
            ti[i].appendChild(document.createTextNode(data.error.CaseSensitive[i]));
            th12.appendChild(ti[i]);
        };

        table.appendChild(th12);


    };

    if (data.error.InvalidRC.length > 0) {

        let ty = [];

        for (i = 0; i < data.error.InvalidRC.length; i++) {
            ty[i] = document.createElement('tr');
            ty[i].appendChild(document.createTextNode(data.error.InvalidRC[i]));
            th10.appendChild(ty[i]);
        };
        table.appendChild(th10);


    };

    if (data.error.SpacesFound.length > 0) {



        let td = [];

        for (i = 0; i < data.error.SpacesFound.length; i++) {
            td[i] = document.createElement('tr');
            td[i].appendChild(document.createTextNode(data.error.SpacesFound[i]));
            th1.appendChild(td[i]);
        };

        table.appendChild(th1);


    };

    if (data.error.MailboxAlreadyExist.length > 0) {

        let tf = [];

        for (i = 0; i < data.error.MailboxAlreadyExist.length; i++) {
            tf[i] = document.createElement('tr');
            tf[i].appendChild(document.createTextNode(data.error.MailboxAlreadyExist[i]));
            th6.appendChild(tf[i]);
        };

        table.appendChild(th6);

    };

    if (data.error.CommunityNotFound.length > 0) {

        let tz = [];

        for (i = 0; i < data.error.CommunityNotFound.length; i++) {
            tz[i] = document.createElement('tr');
            tz[i].appendChild(document.createTextNode(data.error.CommunityNotFound[i]));
            th7.appendChild(tz[i]);
        };

        table.appendChild(th7);

    };

    if (data.error.InvalidEmailAddresses.length > 0) {

        let tg = [];

        for (i = 0; i < data.error.InvalidEmailAddresses.length; i++) {
            tg[i] = document.createElement('tr');
            tg[i].appendChild(document.createTextNode(data.error.InvalidEmailAddresses[i]));
            th2.appendChild(tg[i]);
        };

        table.appendChild(th2);

    };

    if (data.error.CheckFileRename.length > 0) {

        let ts = [];

        for (i = 0; i < data.error.CheckFileRename.length; i++) {
            ts[i] = document.createElement('tr');
            ts[i].appendChild(document.createTextNode(data.error.CheckFileRename[i]));
            th3.appendChild(ts[i]);
        };

        table.appendChild(th3);

    };

    if (data.error.ProducerConfiguration.length > 0) {

        let te = [];

        for (i = 0; i < data.error.ProducerConfiguration.length; i++) {
            te[i] = document.createElement('tr');
            te[i].appendChild(document.createTextNode(data.error.ProducerConfiguration[i]));
            th4.appendChild(te[i]);
        };

        table.appendChild(th4);

    };

    if (data.error.MultipleDestinationConsumer.length > 0) {

        let tm = [];

        for (i = 0; i < data.error.MultipleDestinationConsumer.length; i++) {
            tm[i] = document.createElement('tr');
            tm[i].appendChild(document.createTextNode(data.error.MultipleDestinationConsumer[i]));
            th5.appendChild(tm[i]);
        };

        table.appendChild(th5);

    };

    if (data.error.WeakPassword.length > 0) {

        let tw = [];

        for (i = 0; i < data.error.WeakPassword.length; i++) {
            tw[i] = document.createElement('tr');
            tw[i].appendChild(document.createTextNode(data.error.WeakPassword[i]));
            th8.appendChild(tw[i]);
        };
        table.appendChild(th8);

    };

    if (data.error.VerifyDeliveryPath.length > 0) {

        let tq = [];

        for (i = 0; i < data.error.VerifyDeliveryPath.length; i++) {
            tq[i] = document.createElement('tr');
            tq[i].appendChild(document.createTextNode(data.error.VerifyDeliveryPath[i]));
            th9.appendChild(tq[i]);
        };

        table.appendChild(th9);

    };

    if (table.childElementCount > 0) {

        if (img.className == "pikachu" || h3.className == "result-tag") {
            result.removeChild(img);
            result.removeChild(h3);
            h3.innerHTML = "";
            img.className = "";
            h3.className = "";

        };

        result.appendChild(table);

    } else {

        h3.className = "result-tag";
        img.className = "pikachu";
        img.src = "Molecule.gif";
        h3.appendChild(document.createTextNode('Validation complete! No errors found.'));
        result.appendChild(img);
        result.appendChild(h3);

    };


});