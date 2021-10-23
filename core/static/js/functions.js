$(document).ready(function() {
    verificaLogin();
});

function chamaPage(path, conteiner) {
    path = path.split("/");
    $.ajax({
        url: "web/" + path[path.length - 2],
        error: function() {
            $(conteiner).load("web/generico/generico.html");
        },
        success: function() {
            $(conteiner).load("web/" + path[path.length - 2]);
            elm = $("#sidebar-container")
            corpo = $("#index-pages")
            if(elm.hasClass("d-none")){
                elm.removeClass("d-none")
                corpo.addClass("d-none")
            }else{
                elm.addClass("d-none")
                corpo.removeClass("d-none")
            }
        },
    });
}

function deslogar() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("token_level");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("login");
    $("#corpo").empty();
    $("#corpo").load("web/login");
}

function verificaLogin() {
    token = sessionStorage.getItem("token");
    if (token) {
        data = http.request({
            path: "api/verify/",
            metodo: "POST",
            data: { token: token },
        });
        if (data?.data?.token == "ok") {
            $("#corpo").empty();
            $("#corpo").load("web/corpo");
        } else {
            deslogar();
        }
    } else {
        deslogar();
    }
}

function verificaAcesso() {
    token = sessionStorage.getItem("token");
    if (token) {
        data = http.request({
            path: "api/verify/",
            metodo: "POST",
            data: { token: token },
        });
        if (data?.data?.token != "ok") {
            deslogar();
        }
    } else {
        deslogar();
    }
}

function alertas(text = null, title = null) {
    if (!title) {
        title = "TEÇÁ Air Control";
    }

    if (!text) {
        text = "TEÇÁ Air Control";
    }
    // $("#modal_msg").modal("show");
    BootstrapDialog.show({
        title: title,
        message: text,
        buttons: [{
            label: "OK",
            action: function(dialog) {
                dialog.close();
            },
        }, ],
    });
}

function numberToReal(numero, casas) {
    var numero = numero.toFixed(casas).split(".");
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join(".");
    return numero.join(",");
}

function numberToRealSem(numero, casas) {
    var numero = numero.toFixed(casas).split(".");
    return numero.join(".");
}

function numberToLitros(numero, casas) {
    var numero = numero.toFixed(casas).split(".");
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join(".");
    return numero.join(",");
}

function numberToLitrosSem(numero, casas) {
    var numero = numero.toFixed(casas).split(".");
    return numero.join(".");
}

function leftPad(value, totalWidth, paddingChar) {
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || "0") + value;
}

function timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
}