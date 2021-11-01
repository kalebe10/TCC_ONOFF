function excluir(codigo, nome) {
  BootstrapDialog.show({
    title: "KAS ONOFF Air Control",
    message: `Deseja excluir o agendador ${nome}?`,
    buttons: [
      {
        label: "Sim",
        action: function (dialog) {
          apaga_agendador(codigo);
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

function carrega_modulo() {
  data = http.request({
    path: "api/moduloAtiva/",
  });

  if (data.status == "success") {
    $.each(data.data, function (key, item) {
      $("#agendamento_modulos").append(
        '<option value="' + item.id + '">' + item.apelido + "</option>"
      );
    });
  }
}
carrega_modulo();

function carrega_sala() {
  data = http.request({
    path: "api/salaAtiva/",
  });

  if (data.status == "success") {
    $.each(data.data, function (key, item) {
      $("#agendador_sala").append(
        '<option value="' + item.id + '">' + item.nome + "</option>"
      );
    });
  }
}
carrega_sala();

function carrega_andar() {
  data = http.request({
    path: "api/andarAtiva/",
  });

  if (data.status == "success") {
    $.each(data.data, function (key, item) {
      $("#agendador_andar").append(
        '<option value="' + item.id + '">' + item.nome + "</option>"
      );
    });
  }
}
carrega_andar();

function atualiza_agendador(id) {
  data = http.request({
    path: "api/agendador/" + id + "/",
  });
  if (data.status == "success") {
    modo_acionamento(data.data.tipo_acionamento);
    $("#idagendador").val(data.data.id);
    $("#agendador_nome").val(data.data.nome);
    $("#agendador_data").val(data.data.data);
    $("#agendador_hora").val(data.data.hora);
    if (data.data.loop) {
      loop = 1;
    } else {
      loop = 0;
    }
    $("#agendador_loop").val(loop);
    $("#agendador_data_loop").val(data.data.data_loop);
    $("#agendador_hora_loop").val(data.data.hora_loop);
    if (data.data.ligar == 1) {
      $(`#on_off1`).attr({ checked: true }).prop({ checked: true });
    } else if (data.data.desligar == 1) {
      $(`#on_off0`).attr({ checked: true }).prop({ checked: true });
    } else if (data.data.mudaStatus == 1) {
      $(`#on_off2`).attr({ checked: true }).prop({ checked: true });
    } else {
      $(`#on_off0`).attr({ checked: true }).prop({ checked: true });
    }
    $("#agendador_temperatura").val(data.data.temperatura);
    $(`#modo${data.data.modo}`).attr({ checked: true }).prop({ checked: true });
    $(`#fan${data.data.fan}`).attr({ checked: true }).prop({ checked: true });

    // $("#agendador_modulo").val(data.data.modulo);
    modulos = data.data.modulo.split(",");
    dataModulo = http.request({
      path: "api/moduloAtiva/",
    });
    if (dataModulo.status == "success") {
      $("#agendamento_modulos").empty();
      $("#agendamento_selecionado").empty();
      $.each(dataModulo.data, function (key, item) {
        if ($.inArray(item.id.toString(), modulos) >= 0) {
          $("#agendamento_selecionado").append(
            '<option value="' + item.id + '">' + item.apelido + "</option>"
          );
          // console.log(item)
        } else {
          $("#agendamento_modulos").append(
            '<option value="' + item.id + '">' + item.apelido + "</option>"
          );
        }
      });
    }
    $("#agendador_minuto_loop").val(data.data.minuto_loop);
    $("#agendador_data_inicio").val(data.data.data_inicio);
    $("#agendador_hora_inicio").val(data.data.hora_inicio);
    $("#agendador_data_fim").val(data.data.data_fim);
    $("#agendador_hora_fim").val(data.data.hora_fim);

    $("#agendador_acionamento").val(data.data.tipo_acionamento);
    $("#agendador_sala").val(data.data.sala);
    $("#agendador_andar").val(data.data.andar);

    let dias = data.data.dia_semana.split(",");
    for (let i = 0; i < dias.length; i++) {
      $(`#dia_${dias[i]}`).attr("checked", "checked");
    }

    if (data.data.ativo) {
      ativo = 1;
    } else {
      ativo = 0;
    }
    $("#agendador_ativo").val(ativo);
    $("#novo").val("1");
  }
}

function apaga_agendador(agendador) {
  data = http.request({
    metodo: "DELETE",
    path: "api/agendador/" + agendador + "/",
  });

  if (data.response.status == 204) {
    monta_tabela();
  }
}

function ativa_agendador(agendador, id) {
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
    path: "api/agendador/" + agendador + "/",
    data: payload,
  });
  if (data.status == "success") {
    agendador_agendador();
  }
}

function monta_tabela() {
  tabela = $("#divTable");
  tabela.empty();

  data = http.request({
    path: "api/agendador/",
  });
  data_modulo = http.request({
    path: "api/moduloAtiva/",
  });
  data_sala = http.request({
    path: "api/salaAtiva/",
  });
  data_andar = http.request({
    path: "api/andarAtiva/",
  });

  createTable({
    thead: {
      Nome: {
        target: "nome",
        priority: "critical",
        name: "Nome",
      },
      Modulo: {
        target: "modulo",
        priority: "critical",
        name: "Módulo",
      },
      Andar: {
        target: "andar",
        priority: "4",
        name: "Andar",
      },
      Sala: {
        target: "sala",
        priority: "5",
        name: "Sala",
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
      andar: {
        data: data_andar.data,
        target: "nome",
        find: "id",
      },
      sala: {
        data: data_sala.data,
        target: "nome",
        find: "id",
      },
      atualiza: "atualiza_agendador",
      ativa: "ativa_agendador",
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
  let id = $("#idagendador").val();
  let nome = $("#agendador_nome").val();
  let acionamento = $("#agendador_acionamento").val();
  let data = $("#agendador_data").val();
  let hora = $("#agendador_hora").val();
  let on_off = $("[name=on_off]:checked").val();
  if (on_off == 1) {
    ligar = 1;
    desligar = 0;
  } else if (on_off == 2) {
    ligar = 0;
    desligar = 0;
  } else {
    ligar = 0;
    desligar = 1;
  }
  let andar = $("#agendador_andar").val();
  let ativo = $("#agendador_ativo").val();

  let data_loop = $("#agendador_data_loop").val();
  let hora_loop = $("#agendador_hora_loop").val();
  let minuto_loop = $("#agendador_minuto_loop").val();

  let data_inicio = $("#agendador_data_inicio").val();
  let hora_inicio = $("#agendador_hora_inicio").val();
  let data_fim = $("#agendador_data_fim").val();
  let hora_fim = $("#agendador_hora_fim").val();
  let sala = $("#agendador_sala").val();

  if (data_inicio == "") {
    data_inicio == null;
  }
  if (hora_inicio == "") {
    hora_inicio == null;
  }
  if (data_fim == "") {
    data_fim == null;
  }
  if (hora_fim == "") {
    hora_fim == null;
  }

  let check = $("#check_semana input");
  let dias = [];

  for (let i = 0; i < check.length; i++) {
    if (check[i].checked) {
      dias.push(check[i].value);
    }
  }
  dias = dias.toString();

  let modulosOp = $("#agendamento_selecionado option");
  let modulos = [];
  for (let i = 0; i < modulosOp.length; i++) {
    modulos.push(modulosOp[i]?.value);
  }
  modulos = modulos.toString();
  if (data_loop == "") {
    data_loop = 0;
  }
  if (hora_loop == "") {
    hora_loop = 0;
  }
  if (nome != "") {
    payload = {
      nome: nome,
      data: data,
      hora: hora,
      data_inicio: data_inicio,
      hora_inicio: hora_inicio,
      data_fim: data_fim,
      hora_fim: hora_fim,
      dia_semana: dias,
      data_loop: data_loop,
      hora_loop: hora_loop,
      tipo_acionamento: acionamento,
      minuto_loop: minuto_loop,
      ligar: ligar,
      desligar: desligar,
      modulo: modulos,
      sala: sala,
      andar: andar,
      ativo: ativo,
    };
    // console.log(payload);
    data = http.request({
      metodo: "PATCH",
      path: "api/agendador/" + id + "/",
      data: payload,
    });
    if (data.status == "success") {
      monta_tabela();
      limpa();
      $("#novo").val("0");
      if (ativo > 0) {
        agendador_agendador();
      }
    }
  } else {
    if (nome == "") {
      alert("Preencha o campo Nome");
    }
  }
}

function salva() {
  let nome = $("#agendador_nome").val();
  let acionamento = $("#agendador_acionamento").val();
  let data = $("#agendador_data").val();
  let hora = $("#agendador_hora").val();
  let on_off = $("[name=on_off]:checked").val();

  if (on_off == 1) {
    ligar = 1;
    desligar = 0;
  } else if (on_off == 2) {
    ligar = 0;
    desligar = 0;
  } else {
    ligar = 0;
    desligar = 1;
  }
  let sala = $("#agendador_sala").val();
  let andar = $("#agendador_andar").val();
  let ativo = $("#agendador_ativo").val();

  let data_loop = $("#agendador_data_loop").val();
  let hora_loop = $("#agendador_hora_loop").val();
  let minuto_loop = $("#agendador_minuto_loop").val();

  let data_inicio = $("#agendador_data_inicio").val();
  let hora_inicio = $("#agendador_hora_inicio").val();
  let data_fim = $("#agendador_data_fim").val();
  let hora_fim = $("#agendador_hora_fim").val();

  let check = $("#check_semana input");
  let dias = [];

  for (let i = 0; i < check.length; i++) {
    if (check[i].checked) {
      dias.push(check[i].value);
    }
  }
  dias = dias.toString();

  let modulosOp = $("#agendamento_selecionado option");
  let modulos = [];
  for (let i = 0; i < modulosOp.length; i++) {
    modulos.push(modulosOp[i]?.value);
  }
  modulos = modulos.toString();
  if (data_loop == "") {
    data_loop = 0;
  }
  if (hora_loop == "") {
    hora_loop = 0;
  }
  if (nome != "") {
    payload = {
      nome: nome,
      data: data,
      hora: hora,
      data_inicio: data_inicio,
      hora_inicio: hora_inicio,
      data_fim: data_fim,
      hora_fim: hora_fim,
      dia_semana: dias,
      data_loop: data_loop,
      hora_loop: hora_loop,
      tipo_acionamento: acionamento,
      minuto_loop: minuto_loop,
      ligar: ligar,
      desligar: desligar,
      modulo: modulos,
      sala: sala,
      andar: andar,
      ativo: ativo,
    };
    data = http.request({
      metodo: "POST",
      path: "api/agendador/",
      data: payload,
    });
    if (data.status == "success") {
      monta_tabela();
      limpa();
      if (ativo > 0) {
        agendador_agendador();
      }
    }
  } else {
    if (nome == "") {
      alert("Preencha o campo Nome");
    } else if (agendador == "") {
      alert("Preencha o campo agendador");
    }
  }
}

function limpa() {
  $("#agendador_nome").val("");
  $("#agendador_data").val("");
  $("#agendador_hora").val("");
  $("#agendador_loop").val("");
  $("#agendador_data_loop").val("");
  $("#agendador_hora_loop").val("");
  $("#agendador_on_off").val(0);
  $("#agendador_modulo").val(0);
  $("#agendador_sala").val(0);
  $("#agendador_andar").val(0);
  $("#agendador_dia_semana").val(0);
  $("#agendador_ativo").val(0);
}

function modo_acionamento(modo) {
  let html = "";
  if (modo == 0) {
    html = ` <div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <label>Data</label>
        <input type="date" class="form-control" id="agendador_data" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora</label>
        <input type="time" class="form-control" id="agendador_hora" />
      </div>
    </div>    
    </div>
    `;
  } else if (modo == 1) {
    html = `<div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <label>Data inicio</label>
        <input type="date" class="form-control" id="agendador_data_inicio" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora inicio</label>
        <input type="time" class="form-control" id="agendador_hora_inicio" />
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <label>Data fim</label>
        <input type="date" class="form-control" id="agendador_data_fim" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora fim</label>
        <input type="time" class="form-control" id="agendador_hora_fim" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora execução</label>
        <input type="time" class="form-control" id="agendador_hora" />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-12">
      Dia da Semana
    </div>
  </div>
  <div class="row"  id="check_semana">
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_0" value="0">
        <label class="form-check-label" for="dia_0">Seg</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_1" value="1">
        <label class="form-check-label" for="dia_1">Terç</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_2" value="2">
        <label class="form-check-label" for="dia_2">Qua</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_3" value="3">
        <label class="form-check-label" for="dia_3">Qui</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_4" value="4">
        <label class="form-check-label" for="dia_4">Sex</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_5" value="5">
        <label class="form-check-label" for="dia_5">Sáb</label>
      </div>
    </div>
    <div class="col-sm-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="dia_6" value="6">
        <label class="form-check-label" for="dia_6">Dom</label>
      </div>
    </div>
  </div>  
  <div class="row">
      <br />
    </div>`;
  } else if (modo == 2) {
    html = ` <div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <label>Data inicio</label>
        <input type="date" class="form-control" id="agendador_data_inicio" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora inicio</label>
        <input type="time" class="form-control" id="agendador_hora_inicio" />
      </div>
    </div>
    <div class="col-sm-3">
      <div class="form-group">
        <label>Data fim</label>
        <input type="date" class="form-control" id="agendador_data_fim" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Hora fim</label>
        <input type="time" class="form-control" id="agendador_hora_fim" />
      </div>
    </div>

  </div>
  <div class="row">
    <div class="col-sm-12">
      <h5>Intervalo de execução</h5>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <label>Dias</label>
        <input type="number" class="form-control" id="agendador_data_loop" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Horas</label>
        <input type="number" class="form-control" id="agendador_hora_loop" />
      </div>
    </div>
    <div class="col-sm-2">
      <div class="form-group">
        <label>Minutos</label>
        <input type="number" class="form-control" id="agendador_minuto_loop" />
      </div>
    </div>
  </div>`;
  }
  $("#modo_acionamento").empty().append(html);
}

modo_acionamento(0);

$("#callback")
  .simpleMultiSelect({
    source: "#agendamento_modulos",
    destination: "#agendamento_selecionado",
    adder: "#add_modulo",
    remover: "#remove_modulo",
  })
  .on("option:added", function (e, $option) {
    $("#callback_message").append("added: " + $option.val() + "<br>");
  })
  .on("option:removed", function (e, $option) {
    $("#callback_message").append("removed: " + $option.val() + "<br>");
  });
