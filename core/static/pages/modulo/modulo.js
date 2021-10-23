function excluir(codigo, nome) {
    BootstrapDialog.show({
        title: "KAS ONOFF",
        message: `Deseja excluir o modulo ${nome}?`,
        buttons: [
            {
                label: "Sim",
                action: function (dialog) {
                    apaga_modulo(codigo);
                    dialog.close();
                },
            },
            {
                label: "Não",
                action: function (dialog) {
                    dialog.close();
                },
            },
        ],
    });
}

function carrega_sala() {
    data = http.request({
        path: "api/salaAtiva/",
    });

    if (data.status == "success") {
        $.each(data.data, function (key, item) {
            $("#modulo_sala").append(
                '<option value="' + item.id + '">' + item.nome + "</option>"
            );
        });
    }
}
carrega_sala();

function atualiza_modulo(id) {
    data = http.request({
        path: "api/modulo/" + id + "/",
    });
    if (data.status == "success") {
        $("#idmodulo").val(data.data.id);
        $("#modulo_apelido").val(data.data.apelido);
        $("#modulo_nome").val(data.data.nome);
        $("#modulo_sala").val(data.data.sala);        
        $("#modulo_Mac").val(data.data.mac);
        $("#modulo_ativo").val(Number(data.data.ativo));
        $("#novo").val("1");
    }
}

function apaga_modulo(modulo) {
    data = http.request({
        metodo: "DELETE",
        path: "api/modulo/" + modulo + "/",
    });

    if (data.response.status == 204) {
        monta_tabela();
    }
}

function ativa_modulo(modulo, id) {
    id = id;
    if ($(`#${id}`).is(":checked")) {
        payload = {
            ativo: 1,
        };
    } else {
        payload = {
            ativo: 0,
        };
    }
    data = http.request({
        metodo: "PATCH",
        path: "api/modulo/" + modulo + "/",
        data: payload,
    });
}

function monta_tabela() {
    tabela = $("#divTable");
    tabela.empty();

    data = http.request({
        path: "api/modulo/",
    });
    data_sala = http.request({
        path: "api/salaAtiva/",
    });

    createTable({
        thead: {
            Apelido: {
                target: "apelido",
                priority: "critical",
                name: "Nome",
            },
            Nome: {
                target: "nome",
                priority: "critical",
                name: "Módulo",
            },
            Sala: {
                target: "sala",
                priority: "1",
                name: "Sala",
            },
            Ativo: {
                target: "ativo",
                priority: "2",
                name: "Ativo",
            },
        },
        tbody: data.data,
        element: "#divTable",
        apoio: {
            busca: "id",
            name: "nome",
            sala: {
                data: data_sala.data,
                target: "nome",
                find: "id",
            },
            atualiza: "atualiza_modulo",
            ativa: "ativa_modulo",
            excluir: "excluir",
        },
    });
}
monta_tabela();
function verifica_cadastro() {
    novo = $("#novo").val();
    if (novo == 0) {
        salva();
    } else {
        atualiza();
    }
}

function atualiza() {
    var id = $("#idmodulo").val();
    var apelido = $("#modulo_apelido").val();
    var sala = $("#modulo_sala").val();
    var ativo = $("#modulo_ativo").val();
    if (apelido != "") {
        payload = {
            id: id,
            apelido: apelido,
            sala: sala,
            ativo: ativo,
        };
        data: http.request({
            metodo: "PATCH",
            path: "api/modulo/" + id + "/",
            data: payload,
        });
        if (data.status == "success") {
            monta_tabela();
            limpa();
            $("#novo").val("0");
        }
    } else {
        if (apelido == "") {
            alert("Preencha o campo Nome");
        }
    }
}

function salva() {
    var apelido = $("#modulo_apelido").val();
    var sala = $("#modulo_sala").val();
    var ativo = $("#modulo_ativo").val();
    if (apelido != "") {
        payload = {
            apelido: apelido,
            sala: sala,
            ativo: ativo,
        };

        data = http.request({
            metodo: "POST",
            path: "api/modulo/",
            data: payload,
        });
        if (data.status == "success") {
            monta_tabela();
            limpa();
        }
    } else {
        if (apelido == "") {
            alert("Preencha o campo Nome");
        } else if (modulo == "") {
            alert("Preencha o campo modulo");
        }
    }
}

function limpa() {
    $("#modulo_apelido").val("");
    $("#modulo_modulo").val("");
}