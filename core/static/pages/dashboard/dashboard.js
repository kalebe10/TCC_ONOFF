function modulos() {
  data = http.request({
    path: "api/moduloAtiva/",
  });
  now = new Date();
  inicio = `${now.getFullYear()}-0${now.getMonth() + 1}-${now.getDate()}`;
  if (data.status == "success") {
    valor = 0;
    rows = 0;
    html = '';
    $.each(data.data, function (key, item) {
      if (item.ligar) {
        texto = "text-success";
      } else if (item.desligar) {
        texto = "text-danger";
      } else {
        texto = "text-danger";
      }

      html += `<div class="row ${texto} pl-2"><b>${item.apelido}</b></div>`;
    });
    $("#modulos").append(html);
  }
}
modulos();

$("#divPrevisao").hide();

function dashboard() {
  data = http.request({
    path: "api/dashboard/",
  });
  if (data.status == "success") {
    dados = data.data.dados;
    let consumo = dados.consumo.toString().replace(".",",")
    let valor = dados.valor.toString().replace(".",",")
    $("#consumo").empty().append(`Consumo KWh ${consumo}`);
    $("#gasto").empty().append(`Gasto R$ ${valor}`);
    $("#ligados").empty().append(`Ligados ${dados.ligados}`);
    $("#desligados").empty().append(`Desligados ${dados.desligados}`);
  }

  data = http.request({
    path: "api/previsaoTempo/",
  });
  if (data.status == "success") {
    dados = data.data.dados;
    $("#previsao").empty().append(`${dados}`);
    $("#previsoaIcon")
      .empty()
      .append(
        `<img src="http://openweathermap.org/img/wn/${data.data.icone}.png" />`
      );
    $("#divPrevisao").show();
  }

  data = http.request({
    path: "api/dashboard/",
  });
  if (data.status == "success") {
    dados = data.data.dados;
    data_dia = [];
    data_consumo = [];
    data_acumulado = [];
    data_custo_acumulado = [];
    data_custo = [];
    for (let index = 0; index < dados.ultimo_dia; index++) {
      dia = parseInt(index) + 1;
      data_dia[index] = dia;
      data_consumo[index] = parseFloat(
        dados.consumoDias[dia]["consumido"].toFixed(2)
      );
      data_acumulado[index] = parseFloat(
        dados.consumoDias[dia]["acumulado"].toFixed(2)
      );
      data_custo_acumulado[index] = parseFloat(
        dados.consumoDias[dia]["custo_acu"].toFixed(2)
      );
      data_custo[index] = parseFloat(
        dados.consumoDias[dia]["custo"].toFixed(2)
      );
    }

    var consumo_mes = {
      type: "bar",
      data: {
        labels: data_dia,
        datasets: [
          {
            label: "Consumo (KW)",
            backgroundColor: "rgb(54, 162, 235)",
            borderColor: "rgb(54, 162, 235)",
            data: data_consumo,
            order: 2,
          },
          {
            label: "Acumulado (KW)",
            backgroundColor: "rgb(240, 10, 10)",
            borderColor: "rgb(240, 10, 10)",
            data: data_acumulado,
            fill: false,
            type: "line",
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Consumo em KW do mês",
        },
        tooltips: {
          mode: "index",
          intersect: true,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Dias",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Valor",
            },
          },
        },
      },
    };

    var ctx = document.getElementById("canvas_mes").getContext("2d");
    $("#canvas_mes").html("");
    window.semana = new Chart(ctx, consumo_mes);

    var custo_mes = {
      type: "bar",
      data: {
        labels: data_dia,
        datasets: [
          {
            label: "Custo Dia (R$)",
            backgroundColor: "rgb(54, 162, 235)",
            borderColor: "rgb(54, 162, 235)",
            data: data_custo,
            order: 2,
          },
          {
            label: "Custo Acumulado (R$)",
            backgroundColor: "rgb(240, 10, 10)",
            borderColor: "rgb(240, 10, 10)",
            data: data_custo_acumulado,
            fill: false,
            type: "line",
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Custo em R$ do mês",
        },
        tooltips: {
          mode: "index",
          intersect: true,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Dias",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Valor",
            },
          },
        },
      },
    };

    var ctx = document.getElementById("canvas_mes_custo").getContext("2d");
    $("#canvas_mes_custo").html("");
    window.semana = new Chart(ctx, custo_mes);
  }
}

dashboard();
