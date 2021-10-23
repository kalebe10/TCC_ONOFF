function excluir(codigo, nome) {
    BootstrapDialog.show({
        title: "TEÇÁ Air Control",
        message: `Deseja excluir o sala ${nome}?`,
        buttons: [{
                label: 'Sim',
                action: function(dialog) {
                    apaga_sala(codigo)
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


function carrega_andar() {
    data = http.request({
        path: 'api/andarAtiva/'
    })

    if (data.status == "success") {
        $.each(data.data, function(key, item) {
            $("#sala_andar").append('<option value="' + item.id + '">' + item.nome + '</option>')
        });
    }
}
carrega_andar()

function atualiza_sala(id) {
    data = http.request({
        path: 'api/sala/' + id + "/"
    })
    if (data.status == "success") {
        $('#idsala').val(data.data.id);
        $('#sala_nome').val(data.data.nome);
        $('#sala_andar').val(data.data.andar);
        if (data.data.ativo) {
            ativo = 1
        } else {
            ativo = 0
        }
        $('#sala_ativo').val(ativo);
        $("#novo").val('1')
    }
}

function apaga_sala(sala) {
    data = http.request({
        metodo: 'DELETE',
        path: 'api/sala/' + sala + "/"
    })

    if (data.response.status == 204) {
        monta_tabela()
    }
}

function ativa_sala(sala, id) {
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
        path: 'api/sala/' + sala + "/",
        data: payload
    })
}


function monta_tabela() {

    tabela = $("#table_tipo")
    tabela.empty()
    header_tabela = `<thead class='thead-dark'>
                    <tr>
                        <th>Nome</th>
                        <th>andar</th>
                        <th>Ativo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='table_tipo_corpo'></tbody>`

    tabela.append(header_tabela)

    data = http.request({
        path: 'api/sala/'
    })
    data_andar = http.request({
        path: 'api/andarAtiva/'
    })
    $.each(data.data, function(key, item) {
        andar = data_andar.data.find(andar => andar.id == item.andar)
        if (item.ativo) {
            check = "checked"
        } else {
            check = ""
        }
        $("#table_tipo_corpo").append(
            `<tr>
                <td  style='cursor:pointer' onclick='atualiza_sala("${item.id}")'>${item.nome ? item.nome : ''}</td>
                <td  style='cursor:pointer' onclick='atualiza_sala("${item.id}")'>${andar?.nome ? andar.nome : item.andar}</td>
                <td  style='cursor:pointer'>
                    <div class="custom-control custom-switch">
                        <input type="checkbox" onclick='ativa_sala("${item.id}","switch${item.id}")' class="custom-control-input" id="switch${item.id}" ${check}>
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
    var id = $("#idsala").val()
    var nome = $("#sala_nome").val()
    var andar = $("#sala_andar").val()
    var ativo = $('#sala_ativo').val();
    if (nome != "") {
        payload = {
            "nome": nome,
            "andar": andar,
            "ativo": ativo
        }
        data = http.request({
            metodo: 'PATCH',
            path: 'api/sala/' + id + "/",
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
    var nome = $("#sala_nome").val()
    var andar = $("#sala_andar").val()
    var ativo = $('#sala_ativo').val();
    if (nome != "") {
        payload = {
            "nome": nome,
            "andar": andar,
            "ativo": ativo
        }

        data = http.request({
            metodo: 'POST',
            path: 'api/sala/',
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
        }
    } else {
        if (nome == "") {
            alert("Preencha o campo Nome")
        } else if (sala == "") {
            alert("Preencha o campo sala")
        }
    }
}

function limpa() {
    $('#sala_nome').val('');
    $('#sala_sala').val('');
}