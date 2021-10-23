function andars() {
  data = http.request({
    path: "api/andarAtiva/",
  });
  if (data.status == "success") {
    valor = 0;
    rows = 0;
    html = '<div class="row">';
    $.each(data.data, function (key, item) {
      if (item.ligar == 1) {
        texto = "text-success";
      } else if (item.desligar == 1) {
        texto = "text-danger";
      } else {
        texto = "text-danger";
      }

      if (valor >= 12) {
        valor = 0;
        html += `<div class="col-sm-3">
        <div class="card border-left-primary shadow h-100 py-2" >
            <div class="card-body" style='cursor:pointer' >
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold  text-uppercase">      
                            <div class="row">
                                <div class="col-12 tela ${texto}">
                                  <b><span>${item.nome}</span></b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer  text-center">
                <Button class="btn btn-success" onclick="enviar(${item.id},1,0)"> Ligar </Button>
                <Button class="btn btn-danger" onclick="enviar(${item.id},0,1)"> Desligar </Button>
            </div>
        </div>
    </div>`;
      } else {
        html += `<div class="col-sm-3">
          <div class="card border-left-primary shadow h-100 py-2" >
              <div class="card-body" style='cursor:pointer' >
                  <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <div class="text-xs font-weight-bold  text-uppercase">      
                              <div class="row">
                                  <div class="col-12 tela ${texto}">
                                    <b><span>${item.nome}</span></b>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="card-footer  text-center">
                  <Button class="btn btn-success" onclick="enviar(${item.id},1,0)"> Ligar </Button>
                  <Button class="btn btn-danger" onclick="enviar(${item.id},0,1)"> Desligar </Button>
              </div>
          </div>
      </div>`;
        valor += 3;
      }
    });
    html += "</div>";
    $("#andars_controle").append(html);
  }
}
andars();

function enviar(andar=0, ligar=0, desligar=0) {
  payload = {
    ligar: ligar,
    desligar: desligar,
    andar: andar,
    modulo: 0,
    sala: 0,
  };

  data = http.request({
    metodo: "POST",
    path: "api/automacao/",
    data: payload,
  });
  if (data.status == "success") {
    if (data.data.mensagem == "ok") {
      alertas("Comando Enviado ");
    } else {
      alertas("Comando não Cadastrado ");
    }
  }
}

function setLigar() {
  valueLigar = $("#stateLigar").val();
  icone = $("#ligar");
  if (valueLigar == 0) {
    $("#stateLigar").val("1");
    icone.css("color", "green");
  } else {
    $("#stateLigar").val("0");
    icone.css("color", "red");
  }
}
