function excluir(codigo) {
    BootstrapDialog.show({
        title: "KAS ONOFF Air Control",
        message: `Deseja excluir o usuario ${codigo}?`,
        buttons: [{
                label: 'Sim',
                action: function(dialog) {
                    apaga_user(codigo)
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

function atualiza_user(user) {
    data = http.request({
        path: 'api/user/' + user + "/"
    })

    if (data.status == "success") {
        $('#usuario_user').val(data.data.username);
        $('#usuario_senha').val(data.data.password);
        $('#usuario_nivel').val(data.data.nivel);
        $("#novo").val('1')
    }
}

function apaga_user(user) {
    data = http.request({
        metodo: 'DELETE',
        path: 'api/user/' + user + "/"
    })

    if (data.response.status == 204) {
        monta_tabela()
    }
}

function monta_tabela() {

    tabela = $("#table_usuario")
    tabela.empty()
    header_tabela = `<thead class='thead-dark'>
                    <tr>
                        <th>Usuario</th>
                        <th>Nivel</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id='table_usuario_corpo'></tbody>`

    tabela.append(header_tabela)

    data = http.request({
        path: 'api/usuarios/'
    })
    $.each(data.data, function(key, item) {
        level = item.nivel
        if (level == 0 || level == 1) {
            nivel = 'Master'
        } else if (level == 2) {
            nivel = 'Administrador'
        } else if (level == 99) {
            nivel = 'Operador'
        }
        if (item.user != 'teca') {
            $("#table_usuario_corpo").append(
                `<tr>
                <td style='cursor:pointer' onclick='atualiza_user("${item.username}")'>${item.username}</td>
                <td style='cursor:pointer' onclick='atualiza_user("${item.username}")'>${nivel}</td>
                <td><i style='cursor:pointer' class="fas fa-minus-circle"  onclick='excluir("${item.username}")'></i></td>
            </tr>`
            )
        }
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
    var user = $("#usuario_user").val()
    var senha = $("#usuario_senha").val()
    var nivel = $("#usuario_nivel").val()
    if (user != "" && senha != "") {
        payload = {
            "password": senha,
            "nivel": nivel
        }
        data = http.request({
            metodo: 'PATCH',
            path: 'api/user/' + user + "/",
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
            $("#novo").val('0')
        }
    } else {
        if (user == "") {
            alertas("Preencha o campo user")
        } else if (senha == "") {
            alertas("Preencha o campo senha")
        }
    }
}



function salva() {
    var user = $("#usuario_user").val()
    var senha = $("#usuario_senha").val()
    var nivel = $("#usuario_nivel").val()
    if (user != "" && senha != "") {
        payload = {
            "username": user,
            "password": senha,
            "nivel": nivel
        }

        data = http.request({
            metodo: 'POST',
            path: 'api/user/',
            data: payload
        })
        if (data.status == "success") {
            monta_tabela();
            limpa()
        }
    } else {
        if (user == "") {
            alertas("Preencha o campo user")
        } else if (senha == "") {
            alertas("Preencha o campo senha")
        }
    }
}

function limpa() {
    $('#usuario_user').val('');
    $('#usuario_senha').val('');
}