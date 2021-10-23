function excluir(codigo, nome) {
    BootstrapDialog.show({
        title: "TEÇÁ Air Control",
        message: `Deseja excluir o secret ${nome}?`,
        buttons: [{
                label: 'Sim',
                action: function(dialog) {
                    apaga_secret(codigo)
                    dialog.close();
                }
            },
            {
                label: 'Não',
                action: function(dialog) {
                    dialog.close();
                }
            }
        ]
    });
}

function atualiza_secret(id) {
    data = http.request({
        path: 'api/secret/' + id + "/"
    })
    if (data.status == "success") {
        $('#idsecret').val(data.data.id);
        $('#secret_nome').val(data.data.nome);
        $("#novo").val('1')
    }
}

function apaga_secret(secret) {
    data = http.request({
        metodo: 'DELETE',
        path: 'api/secret/' + secret + "/"
    })

    if (data.response.status == 204) {
        monta_tabela()
    }
}


function monta_tabela() {

    tabela = $("#table_tipo")
    tabela.empty()
    header_tabela = `<thead class='thead-dark'>
                    <tr>
                        <th>Nome</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='table_tipo_corpo'></tbody>`

    tabela.append(header_tabela)

    data = http.request({
        path: 'api/secret/'
    })
    $.each(data.data, function(key, item) {
        if (item.ativo) {
            check = "checked"
        } else {
            check = ""
        }
        $("#table_tipo_corpo").append(
            `<tr>
                <td  style='cursor:pointer' onclick='atualiza_secret("${item.id}")'>${item.nome ? item.nome : ''}</td>
                <td><i style='cursor:pointer' class="fas fa-minus-circle"  onclick='excluir("${item.id}","${item.nome}")'></i></td>
            </tr>`
        )
    });
}
monta_tabela()

function verifica_cadastro() {
    novo = $("#novo").val()
    if (novo == 0) {
        salva()
    } else {
        atualiza()
    }
}

function atualiza() {
    var id = $("#idsecret").val()
    var nome = $("#secret_nome").val()
    if (nome != "") {
        payload = {
            "nome": nome,
        }
        data = http.request({
            metodo: 'PATCH',
            path: 'api/secret/' + id + "/",
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
            $("#novo").val('0')
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome")
        }
    }
}

function salva() {
    var nome = $("#secret_nome").val()
    if (nome != "") {
        payload = {
            "nome": nome,
        }

        data = http.request({
            metodo: 'POST',
            path: 'api/secret/',
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome")
        } else if (secret == "") {
            alert("Preencha o campo secret")
        }
    }
}

function limpa() {
    $('#secret_nome').val('');
    $('#secret_secret').val('');
}