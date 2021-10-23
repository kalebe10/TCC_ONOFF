function excluir(codigo, nome) {
    BootstrapDialog.show({
        title: "TEÇÁ Air Control",
        message: `Deseja excluir o andar ${nome}?`,
        buttons: [{
                label: 'Sim',
                action: function(dialog) {
                    apaga_andar(codigo)
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

function atualiza_andar(id) {
    data = http.request({
        path: 'api/andar/' + id + "/"
    })
    if (data.status == "success") {
        $('#idandar').val(data.data.id);
        $('#andar_nome').val(data.data.nome);
        if (data.data.ativo) {
            ativo = 1
        } else {
            ativo = 0
        }
        $('#andar_ativo').val(ativo);
        $("#novo").val('1')
    }
}

function apaga_andar(andar) {
    data = http.request({
        metodo: 'DELETE',
        path: 'api/andar/' + andar + "/"
    })

    if (data.response.status == 204) {
        monta_tabela()
    }
}

function ativa_andar(andar, id) {
    id = id
    if ($(`#${id}`).is(":checked")) {
        payload = {
            "ativo": 1
        }
    } else {
        payload = {
            "ativo": 0
        }
    }
    data = http.request({
        metodo: 'PATCH',
        path: 'api/andar/' + andar + "/",
        data: payload
    })
}


function monta_tabela() {

    tabela = $("#table_tipo")
    tabela.empty()
    header_tabela = `<thead class='thead-dark'>
                    <tr>
                        <th>Nome</th>
                        <th>Ativo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='table_tipo_corpo'></tbody>`

    tabela.append(header_tabela)

    data = http.request({
        path: 'api/andar/'
    })
    $.each(data.data, function(key, item) {
        if (item.ativo) {
            check = "checked"
        } else {
            check = ""
        }
        $("#table_tipo_corpo").append(
            `<tr>
                <td  style='cursor:pointer' onclick='atualiza_andar("${item.id}")'>${item.nome ? item.nome : ''}</td>
                <td  style='cursor:pointer'>
                    <div class="custom-control custom-switch">
                        <input type="checkbox" onclick='ativa_andar("${item.id}","switch${item.id}")' class="custom-control-input" id="switch${item.id}" ${check}>
                        <label class="custom-control-label" for="switch${item.id}"></label>
                    </div>
                </td>
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
    var id = $("#idandar").val()
    var nome = $("#andar_nome").val()
    var ativo = $('#andar_ativo').val();
    if (nome != "") {
        payload = {
            "nome": nome,
            "ativo": ativo
        }
        data = http.request({
            metodo: 'PATCH',
            path: 'api/andar/' + id + "/",
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
    var nome = $("#andar_nome").val()
    var ativo = $('#andar_ativo').val();
    if (nome != "") {
        payload = {
            "nome": nome,
            "ativo": ativo
        }

        data = http.request({
            metodo: 'POST',
            path: 'api/andar/',
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome")
        } else if (andar == "") {
            alert("Preencha o campo andar")
        }
    }
}

function limpa() {
    $('#andar_nome').val('');
    $('#andar_andar').val('');
}