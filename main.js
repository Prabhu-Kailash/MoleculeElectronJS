const {
    app,
    BrowserWindow,
    Menu,
    globalShortcut,
    ipcMain
} = require('electron');

const path = require('path');

const yaml = require('js-yaml');

const fs = require('fs-extra');
const os = require('os');
const {
    exec
} = require('child_process');

const csv = require('csvtojson');

process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;

const isWin = process.platform === 'win32' ? true : false;

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Molecule',
        frame: false,
        width: 600,
        height: 650,
        icon: `${__dirname}/icons/molecule.png`,
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`file://${__dirname}/app/main.html`);


};


const LFGRC = ["LFG_Generic_Static_Route_1",
    "LFG_Generic_Static_Route_OB_Pull_Encrypt",
    "LFG_Generic_Static_Route_OB_Pull_Encrypt_Sign",
    "LFG_Generic_Static_Route_PGP_Decrypt_Any_1",
    "LFG_Generic_Static_Routing",
    "LFG_Generic_Static_Routing_1",
    "LFG_Generic_Static_Routing_Outbound_Pull",
    "LFG_Generic_Static_Routing_PGP_Decrypt_1",
    "LFG_Generic_Static_Routing_PGP_Encrypt_Sign_1",
    "LFG_Generic_Static_Routing_PGP_Encryption",
    "LFG_Generic_Static_Routing_PGP_Encryption_1",
    "LFG_Generic_Static_Routing_Secondary_MBX_1",
    "LFG_Generic_Static_Routing_Secondary_MBX_2",
    "LFG_Static_P2C_PGP_Encrypt_Secondary_MBX",
    "LFG_Static_P2C_PGP_Encrypt_Sign_Secondary_MBX",
    "LFG_Static_P2C_Secondary_MBX",
    "LFG_Static_PGP_Encrypt_Secondary_MBX",
    "LFG_Static_PGP_Encrypt_Sign_Secondary_MBX"
];

ipcMain.on('PostMan', (e, val) => {

    let dir = os.homedir() + "\\Molecule\\PostOffice";
    let executablePath = dir + '\\PostMan.exe';
    let child = require('child_process').exec;
    child(executablePath, function (err, data) {

        mainWindow.webContents.send('PostOffice', {
            err,
            data
        });

    });


});


ipcMain.on('Crusher', (e, val) => {

    let dir = os.homedir() + "\\Molecule\\Crusher";
    let executablePath = dir + '\\Closer.exe';
    let child = require('child_process').exec;

    child(executablePath, function (err, data) {

        mainWindow.webContents.send('Crushed', {
            err,
            data
        });

    });

});

ipcMain.on('BigBang', (e, val) => {
    let dir = os.homedir() + "\\Molecule\\BigBang";
    let executablePath = dir + '\\BigBang.exe';
    let child = require('child_process').exec;
    child(executablePath, function (err, data) {
        mainWindow.webContents.send('python:BigBang', {
            err,
            data
        });
    });
});


ipcMain.on('Python', (e, val) => {

    let dir = os.homedir() + "\\Molecule\\CRs"
    let executablePath = dir + '\\build.exe';
    let executablePath1 = dir + '\\Network.exe';
    let child = require('child_process').exec;

    if (val.isChecked == false) {
        child(executablePath, function (err, data) {
            mainWindow.webContents.send('python:done', {
                err,
                data
            });

        });

    } else if (val.isChecked == true) {
        child(executablePath1, function (err, data) {
            mainWindow.webContents.send('python:done', {
                err,
                data
            });
        });
    };
});



ipcMain.on('JSON:Data', (e, data) => {
    let converter = csv()
        .fromFile(data.filepath).then((JSON) => {
            data.CSVData = JSON;

            let error = {
                SpacesFound: [],
                InvalidEmailAddresses: [],
                CheckFileRename: [],
                ProducerConfiguration: [],
                MultipleDestinationConsumer: [],
                MailboxAlreadyExist: [],
                CommunityNotFound: [],
                WeakPassword: [],
                VerifyDeliveryPath: [],
                InvalidRC: [],
                MaxCharExceeded: [],
                CaseSensitive: []
            };

            if (data.radio == "PreProd") {
                let dir = fs.readdirSync('\\\\path\\to\\repo\\nonprod\\');
                let files = dir.filter(file => file.match(/^.*\.(yaml)$/ig));
                let doc1 = [];
                for (let n = 0; n < files.length; n++) {
                    if (files[n] != "GP4BurgerBusters2LFG.yaml") {
                        let doc = yaml.safeLoad(fs.readFileSync('\\\\path\\to\\repo\\nonprod\\' + files[n]), 'utf8');
                        doc1.push(doc);
                    };
                };
            };

            if (data.radio == "Prod") {
                let dir = fs.readdirSync('\\\\path\\to\\repo\\prod\\');
                let files = dir.filter(file => file.match(/^.*\.(yaml)$/ig));
                let doc1 = [];
                for (let n = 0; n < files.length; n++) {
                    let doc = yaml.safeLoad(fs.readFileSync('\\\\path\\to\\repo\\prod\\' + files[n]), 'utf8');
                    doc1.push(doc);
                };

            };

            function whiteSpaces(s) {

                if (s.length != s.replace(" ", "").length) {

                    error.SpacesFound.push(s);
                };

            };

            function validateEmail(email) {
                let re = email.indexOf("@");
                let me = email.lastIndexOf("@");
                if (re != me) {
                    error.InvalidEmailAddresses.push(email);
                };

                if (re == -1 && me == -1) {
                    error.InvalidEmailAddresses.push(email);
                };
            };

            function MBXcheck() {
                for (let i = 0; i < data.CSVData.length; i++) {

                    let j = i + 1;

                    if (i == data.CSVData.length - 1) {
                        j = i;
                    };
                    let g = LFGRC.includes(data.CSVData[i].RoutingChannelTemplate);

                    if (g == false) {
                        error.InvalidRC.push(data.CSVData[i].RoutingChannelTemplate);
                    };
                    let string = data.CSVData[i].RequesterEmailAddress;
                    let requester = string.split(" ");

                    let string1 = data.CSVData[i].DetailEmail;
                    let detail = string1.split(" ");

                    let string2 = data.CSVData[i].ConfirmEmail;
                    let confirm = string2.split(" ");

                    let string3 = data.CSVData[i].FailEmail;
                    let fail = string3.split(" ");

                    if (requester[0] != "") {

                        for (let a = 0; a < requester.length; a++) {
                            validateEmail(requester[a]);
                        };
                    };

                    if (detail[0] != "") {

                        for (let b = 0; b < detail.length; b++) {
                            validateEmail(detail[b]);
                        };

                    };

                    if (confirm[0] != "") {

                        for (let c = 0; c < confirm.length; c++) {
                            validateEmail(confirm[c]);
                        };
                    };

                    if (fail[0] != "") {

                        for (let d = 0; d < fail.length; d++) {
                            validateEmail(fail[d]);
                        };
                    };

                    whiteSpaces(data.CSVData[i].LineOfBusiness);
                    whiteSpaces(data.CSVData[i].Department);
                    whiteSpaces(data.CSVData[i].TradingPartner);
                    whiteSpaces(data.CSVData[i].Mailbox);
                    whiteSpaces(data.CSVData[i].RoutingChannelTemplate);
                    whiteSpaces(data.CSVData[i].ProducerConsumer);
                    whiteSpaces(data.CSVData[i].Producer);
                    whiteSpaces(data.CSVData[i].Community);
                    whiteSpaces(data.CSVData[i].RequesterEmailAddress);
                    whiteSpaces(data.CSVData[i].Password);
                    whiteSpaces(data.CSVData[i].AuthorizedUserKey);
                    whiteSpaces(data.CSVData[i].AuthorizedUserKeyInfo);
                    whiteSpaces(data.CSVData[i].PGPRequired);
                    whiteSpaces(data.CSVData[i].PGPSigned);
                    whiteSpaces(data.CSVData[i].PGPCompress);
                    whiteSpaces(data.CSVData[i].PublicId);
                    whiteSpaces(data.CSVData[i].DropAndHold);
                    whiteSpaces(data.CSVData[i].SSHProfileID);
                    whiteSpaces(data.CSVData[i].FileRename);

                    CharLength = data.CSVData[i].Mailbox;

                    if (CharLength.length > 36) {
                        error.MaxCharExceeded.push(data.CSVData[i].Mailbox);
                    };

                    if (data.CSVData[i].ProducerConsumer != "Producer" && data.CSVData[i].RoutingChannelTemplate != "LFG_Generic_Static_Routing_Secondary_MBX_2" && data.CSVData[i].RoutingChannelTemplate != "LFG_Generic_Static_Routing_Secondary_MBX_1") {
                        let el = files.some(m => m.includes(data.CSVData[i].Producer));
                        if (el == false) {
                            let coverted = files.map(v => v.toLowerCase());
                            let lower = data.CSVData[i].Producer.toLowerCase();
                            let el = coverted.some(a => a.includes(lower));
                            if (el) {
                                error.CaseSensitive.push(data.CSVData[i].Producer);
                            };
                        };
                    };

                    if (data.CSVData[i].FileRename == "-CMB-.-OF1-_-DT2-.-OF2--XPG-") {
                        if (data.CSVData[i].Mailbox == data.CSVData[j].Mailbox.slice(0, -2)) {
                            if (data.CSVData[j].FileRename != "-PMB-.-OF1-_-DT2-.-OF2--XPG-") {
                                error.CheckFileRename.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].FileRename);
                            };
                        };
                    };


                    if (data.CSVData[i].ProducerConsumer == "Producer" || data.CSVData[i].ProducerConsumer == "producer") {

                        if (data.CSVData[i].Mailbox != data.CSVData[i].Producer) {
                            error.ProducerConfiguration.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Producer);
                        };

                        if (data.CSVData[i].DropAndHold == "" || data.CSVData[i].PublicId != "" || data.CSVData[i].PGPCompress == "" || data.CSVData[i].PGPSigned == "" || data.CSVData[i].PGPRequired == "" || data.CSVData[i].AuthorizedUserKeyInfo != "" || data.CSVData[i].SSHProfileID != "" || data.CSVData[i]["Delivery Path"] != "" || data.CSVData[i].FileRename != "" || data.CSVData[i].DetailEmail != "" || data.CSVData[i].ConfirmEmail != "" || data.CSVData[i].FailEmail != "") {
                            error.ProducerConfiguration.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Producer);

                        };

                    };

                    if (data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_2") {

                        if (data.CSVData[i].Mailbox.slice(-2) != "_1") {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].RoutingChannelTemplate);

                        };

                    };

                    if (data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_1") {

                        if (data.CSVData[i].Mailbox.slice(-2) != "_1" && data.CSVData[i].Mailbox.slice(-2) != "_2") {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].RoutingChannelTemplate);

                        };

                    };


                    if ((data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_2" || data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_1") && data.CSVData[i].Mailbox.slice(-2) == "_1") {

                        if (data.CSVData[i].Mailbox.slice(0, -2) != data.CSVData[i].Producer) {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Producer);

                        };

                    };

                    if (data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_1" && data.CSVData[i].Mailbox.slice(-2) == "_2") {

                        if (data.CSVData[i].Mailbox.slice(0, -2) + "_1" != (data.CSVData[i].Producer)) {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Producer);

                        };

                    };



                    if ((data.CSVData[i].Mailbox.slice(-2) == "_1" || data.CSVData[i].Mailbox.slice(-2) == "_2") && data.CSVData[i].Mailbox.slice(0, -2) != data.CSVData[j].Mailbox.slice(0, -2)) {

                        if (data.CSVData[i].RoutingChannelTemplate != "LFG_Generic_Static_Routing_Secondary_MBX_1") {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].RoutingChannelTemplate);

                        };

                    };

                    if ((data.CSVData[i].Mailbox.slice(-2) == "_1" || data.CSVData[i].Mailbox.slice(-2) == "_2") && i == j) {

                        if (data.CSVData[i].RoutingChannelTemplate != "LFG_Generic_Static_Routing_Secondary_MBX_1") {

                            error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].RoutingChannelTemplate);

                        };

                    };


                    if (data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_1" || data.CSVData[i].RoutingChannelTemplate == "LFG_Generic_Static_Routing_Secondary_MBX_2") {



                        if (j < data.CSVData.length) {


                            if (data.CSVData[i].Mailbox.slice(-2) == "_1" && data.CSVData[j].Mailbox.slice(-2) == "_2") {

                                if (data.CSVData[i].Mailbox.slice(0, -2) == data.CSVData[j].Mailbox.slice(0, -2)) {

                                    let MB1 = data.CSVData[i].Mailbox;
                                    let MB2 = data.CSVData[j].Mailbox;

                                    let RC1 = data.CSVData[i].RoutingChannelTemplate;
                                    let RC2 = data.CSVData[j].RoutingChannelTemplate;

                                    if (RC1 != "LFG_Generic_Static_Routing_Secondary_MBX_2" || RC2 != "LFG_Generic_Static_Routing_Secondary_MBX_1") {

                                        error.MultipleDestinationConsumer.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].RoutingChannelTemplate);
                                        error.MultipleDestinationConsumer.push(data.CSVData[j].Mailbox + " " + data.CSVData[j].RoutingChannelTemplate);
                                    };


                                };


                            };

                        };


                    };


                    if (data.radio == "Prod") {


                        for (let o = 0; o < doc1.length; o++) {

                            try{
                                if (Boolean(doc1[o].ibm_b2b_trading_partner[data.CSVData[i].Mailbox])) {
                                    error.MailboxAlreadyExist.push(data.CSVData[i].Mailbox);
    
                                }
                            } catch (e) {
                                console.log(e)
                            };
                            

                        };

                        if (data.CSVData[i].Community == "Prod_AMGCE" || data.CSVData[i].Community == "Prod_EDM" || data.CSVData[i].Community == "Prod_HR" || data.CSVData[i].Community == "Prod_LibertyMutual" || data.CSVData[i].Community == "Prod_NonStandard" || data.CSVData[i].Community == "Prod_RPS" || data.CSVData[i].Community == "SFGAdmin_Test") {

                            console.log("All Good")

                        } else {

                            error.CommunityNotFound.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Community);
                        };


                    };

                    let str = data.CSVData[i].Password;

                    if (str.match(/[a-z]/g) && str.match(/[A-Z]/g) && str.match(/[0-9]/g) && str.match(/[^a-zA-Z\d]/g) && str.length >= 8) {
                        console.log("Green")
                    } else {
                        error.WeakPassword.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Password);
                    };

                    if (data.radio == "PreProd") {

                        for (let o = 0; o < doc1.length; o++) {


                            if (Boolean(doc1[o].ibm_b2b_trading_partner[data.CSVData[i].Mailbox])) {
                                error.MailboxAlreadyExist.push(data.CSVData[i].Mailbox);

                            };

                        };


                        if (data.CSVData[i].Community ==  "Preprod_AMGCE" || data.CSVData[i].Community == "PreProd_HR" || data.CSVData[i].Community == "PreProd_NonStandard" || data.CSVData[i].Community == "PreProd_NormalTransfer" || data.CSVData[i].Community == "PreProd_RPS" || data.CSVData[i].Community == "Preprod_EDM" || data.CSVData[i].Community == "Preprod_LibertyMutual" || data.CSVData[i].Community == "Preprod_Utilities" || data.CSVData[i].Community == "SFGAdmin_Test" || data.CSVData[i].Community == "SFGAdmin_Test_OOTB") {

                            console.log("All Good")

                        } else {

                            error.CommunityNotFound.push(data.CSVData[i].Mailbox + " " + data.CSVData[i].Community);
                        };
                    };


                    if (data.CSVData[i].SSHProfileID == "891380141b85c553fnode1") {

                        try {

                            let dir = data.CSVData[i]["Delivery Path"].replace(/\\/g, "/");

                            let n = dir.includes("_");

                            if (n == false) {
                                dir = data.CSVData[i]["Delivery Path"].replace(/\\/g, "/").replace(/\//, "_");
                            };

                            if (data.CSVData[i]["Delivery Path"] != dir) {
                                error.VerifyDeliveryPath.push(data.CSVData[i].Mailbox + " " + data.CSVData[i]["Delivery Path"]);

                            };

                        } catch {
                            error.VerifyDeliveryPath.push(data.CSVData[i].Mailbox + " " + data.CSVData[i]["Delivery Path"]);

                        };

                    };

                };
            };

            MBXcheck();

            mainWindow.webContents.send('complete', {
                error
            })

        })


})

app.on('window-all-closed', () => {
    if (true) {
        try {
            let dir1 = os.homedir() + "\\Molecule\\Crusher";
            fs.readdir(dir1, (err, files1) => {

                if (files1 != undefined) {
                    for (const file1 of files1) {
                        fs.unlink(path.join(dir1, file1), err => {
                            if (err) {
                                console.log(err)
                            };
                        });
                    };

                };
            });
        } catch (e) {
            console.log(e)
        };

        try {
            let dir1 = os.homedir() + "\\Molecule\\BigBang"
            fs.readdir(dir1, (err, files1) => {
 
                if (files1 != undefined) {
                    for (const file1 of files1) {
                        fs.unlink(path.join(dir1, file1), err => {
                            if (err) {
                                console.log(err);
                            };
                        });
                    };

                };
            });
        } catch (e) {
            console.log(e);

        };

        try {
            let dir2 = os.homedir() + "\\Molecule\\CRs"
            fs.readdir(dir2, (err, files2) => {
                if (err) {
                    console.log(err)
                }
                if (files2 != undefined) {
                    for (const file2 of files2) {
                        fs.unlink(path.join(dir2, file2), err => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }

                }

            })
        } catch (e) {
            console.log(e);
        };

        try {
            let dir3 = os.homedir() + "\\Molecule\\PostOffice";
            fs.readdir(dir3, (err, files3) => {
                if (err) {
                    console.log(err);
                }
                if (files3 != undefined) {
                    for (const file3 of files3) {
                        fs.unlink(path.join(dir3, file3), err => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }

                }
            })
        } catch (e) {
            console.log(e);
        };

        try {
            let dir9 = os.homedir() + "\\Molecule\\Crusher";
            fs.removeSync(dir9);
            let dir8 = os.homedir() + "\\Molecule\\PostOffice";
            fs.removeSync(dir8);
            let dir7 = os.homedir() + "\\Molecule\\CRs";
            fs.removeSync(dir7);
            let dir10 = os.homedir() + "\\Molecule\\BigBang";
            fs.removeSync(dir10);
            let dir6 = os.homedir() + "\\Molecule";
            fs.removeSync(dir6);

        } catch (e) {
            console.log(e);
        };
        app.quit();
    };
});


app.on('ready', () => {
    createMainWindow()
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(null)
    globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    globalShortcut.register('CmdOrCtrl+I+P', () => mainWindow.toggleDevTools())

});