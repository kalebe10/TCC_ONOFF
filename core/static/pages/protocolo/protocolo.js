function excluir(codigo, nome) {
    BootstrapDialog.show({
        title: "TEÇÁ Air Control",
        message: `Deseja excluir o protocolo ${nome}?`,
        buttons: [
            {
                label: "Sim",
                action: function (dialog) {
                    apaga_protocolo(codigo);
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

function carrega_marca() {
    data = http.request({
        path: "api/marcaAtiva/",
    });

    if (data.status == "success") {
        $.each(data.data, function (key, item) {
            $("#protocolo_marca").append(
                '<option value="' + item.id + '">' + item.nome + "</option>"
            );
        });
    }
}
carrega_marca();

function atualiza_protocolo(id) {
    data = http.request({
        path: "api/protocolo/" + id + "/",
    });
    if (data.status == "success") {
        $("#idprotocolo").val(data.data.id);
        $("#protocolo_nome").val(data.data.nome);
        $("#protocolo_marca").val(data.data.marca);
        $("#protocolo_onoff").val(Number(data.data.onoff));
        $("#protocolo_ativo").val(Number(data.data.ativo));
        $("#novo").val("1");
    }
}

function apaga_protocolo(protocolo) {
    data = http.request({
        metodo: "DELETE",
        path: "api/protocolo/" + protocolo + "/",
    });

    if (data.response.status == 204) {
        monta_tabela();
    }
}

function ativa_protocolo(protocolo, id) {
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
        path: "api/protocolo/" + protocolo + "/",
        data: payload,
    });
}

function monta_tabela() {
    tabela = $("#divTable");
    tabela.empty();

    data = http.request({
        path: "api/protocolo/",
    });
    data_marca = http.request({
        path: "api/marcaAtiva/",
    });

    createTable({
        thead: {
            Nome: {
                target: "nome",
                priority: "critical",
                name: "Nome",
            },
            Marca: {
                target: "marca",
                priority: "critical",
                name: "Marca",
            },
            Alterna: {
                target: "onoff",
                priority: "5",
                name: "Alterna",
            },
            Ativo: {
                target: "ativo",
                priority: "3",
                name: "Ativo",
            },
        },
        tbody: data.data,
        element: "#divTable",
        apoio: {
            busca: "id",
            marca: {
                data: data_marca.data,
                target: "nome",
                find: "id",
            },
            atualiza: "atualiza_protocolo",
            ativa: "ativa_protocolo",
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
    var id = $("#idprotocolo").val();
    var nome = $("#protocolo_nome").val();
    var marca = $("#protocolo_marca").val();
    var ativo = $("#protocolo_ativo").val();
    var onoff = $("#protocolo_onoff").val();
    if (nome != "") {
        payload = {
            nome: nome,
            marca: marca,
            ativo: ativo,
            onoff: onoff,
        };
        data = http.request({
            metodo: "PATCH",
            path: "api/protocolo/" + id + "/",
            data: payload,
        });
        if (data.status == "success") {
            monta_tabela();
            limpa();
            $("#novo").val("0");
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome");
        }
    }
}

function salva() {
    var nome = $("#protocolo_nome").val();
    var marca = $("#protocolo_marca").val();
    var ativo = $("#protocolo_ativo").val();
    var onoff = $("#protocolo_onoff").val();
    if (nome != "") {
        payload = {
            nome: nome,
            marca: marca,
            ativo: ativo,
            onoff: onoff,
        };

        data = http.request({
            metodo: "POST",
            path: "api/protocolo/",
            data: payload,
        });
        if (data.status == "success") {
            monta_tabela();
            limpa();
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome");
        } else if (protocolo == "") {
            alert("Preencha o campo protocolo");
        }
    }
}

function limpa() {
    $("#protocolo_nome").val("");
    $("#protocolo_protocolo").val("");
}

function sync() {
    data = http.request({
        path: "api/protocoloSync/",
    });

    if (data.status == "success") {
        monta_tabela();
    }
}
