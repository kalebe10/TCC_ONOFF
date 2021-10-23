gets = {
    FPList: [        
        {
            ID: 4,
            conteiner: "#index-pages",
            Nome: "andar",
            Path: "andar/andar.html",
            Icone: "<i class='fas fa-users-cog mr-3'></i>",
            MenuPath: "Cadastro/Andar",
            MenuText: "Andar",
            MenuIcon: "<span class='fa fa-user fa-fw mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 1,
        },
        {
            ID: 3,
            conteiner: "#index-pages",
            Nome: "sala",
            Path: "sala/sala.html",
            Icone: "<i class='fas fa-users-cog mr-3'></i>",
            MenuPath: "Cadastro/Sala",
            MenuText: "Sala",
            MenuIcon: "<span class='fa fa-user fa-fw mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 1,
        },
        {
            ID: 3,
            conteiner: "#index-pages",
            Nome: "secret",
            Path: "secret/secret.html",
            Icone: "<i class='fas fa-users-cog mr-3'></i>",
            MenuPath: "Cadastro/Palavra Secreta",
            MenuText: "Palavra Secreta",
            MenuIcon: "<span class='fa fa-user fa-fw mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 1,
        },
        {
            ID: 2,
            conteiner: "#index-pages",
            Nome: "modulo",
            Path: "modulo/modulo.html",
            Icone: "<i class='fas fa-users-cog mr-3'></i>",
            MenuPath: "Cadastro/Módulo",
            MenuText: "Módulo",
            MenuIcon: "<span class='fa fa-user fa-fw mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 1,
        },
        {
            ID: 6,
            conteiner: "#index-pages",
            Nome: "agendador",
            Path: "agendador/agendador.html",
            Icone: "<i class='fas fa-users-cog mr-3'></i>",
            MenuPath: "Cadastro/Programação de Funcionamento",
            MenuText: "Programação de Funcionamento",
            MenuIcon: "<span class='fa fa-user fa-fw mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 1,
        },
        {
            ID: 12,
            conteiner: "#index-pages",
            Nome: "controle_andar",
            Path: "controle_andar/controle_andar.html",
            Icone: "<i class='fas fa-fan mr-3'></i>",
            MenuPath: "Controle/Andar",
            MenuText: "Andar",
            MenuIcon: "<span class='fas fa-fan mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 2,
        },
        {
            ID: 13,
            conteiner: "#index-pages",
            Nome: "controle_sala",
            Path: "controle_sala/controle_sala.html",
            Icone: "<i class='fas fa-fan mr-3'></i>",
            MenuPath: "Controle/Sala",
            MenuText: "Sala",
            MenuIcon: "<span class='fas fa-fan mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 2,
        },
        {
            ID: 11,
            conteiner: "#index-pages",
            Nome: "controle_modulo",
            Path: "controle_modulo/controle_modulo.html",
            Icone: "<i class='fas fa-fan mr-3'></i>",
            MenuPath: "Controle/Módulo",
            MenuText: "Módulo",
            MenuIcon: "<span class='fas fa-fan mr-3'></span>",
            Funcao: "chamaPage",
            nivel: 2,
        },
    ],
};

function menu() {
    var token_level = sessionStorage.getItem("token_level");
    var user_super = sessionStorage.getItem("user_super");
    var user = sessionStorage.getItem("user");
    data = gets.FPList;
    $.each(data, function (key, a) {
        var caminhoPath = a.Path.toLowerCase();
        var menuTexto = a.MenuText;
        var WorkClassType = "a.WorkClassType";
        var classe = "";
        var Icone = a.Icone;
        var nome = a.Nome;
        var MenuIcon = a.MenuIcon;
        var conteiner = a.conteiner;
        var funcao = a.Funcao;
        var idJson = a.ID;
        var level = a.nivel;
        var super_user = a.super;

        path = a.MenuPath;
        path = path.split("/");
        if (level >= token_level) {
            for (var i = 0; i < path.length; i++) {
                html = "";
                if (i == 0) {
                    pai = "menu";

                    idLocal = path[i].replace(/\s+/g, "").split(".").join("");
                    html =
                        "<div id='menu" +
                        idLocal +
                        "'>" +
                        "<div id='menu" +
                        idLocal +
                        "Label'>" +
                        "<span href='#menu" +
                        idLocal +
                        "Itens' data-toggle='collapse' aria-expanded='false'";
                    if (path.length == 1) {
                        html +=
                            "onclick=\"chamaPage('" +
                            caminhoPath +
                            "','" +
                            conteiner +
                            "')\"";
                    }

                    html +=
                        "class='bg-dark list-group-item list-group-item-action seta'>" +
                        "<div class='d-flex align-items-center text-white'>";

                    if (MenuIcon) {
                        html += MenuIcon;
                    }
                    html +=
                        "<span class='menu-collapsed texto-menu'>" +
                        path[i] +
                        "</span>";

                    if (path.length > 1) {
                        html +=
                            "<span class='fa fa-sort-down ml-auto menu-collapsed '></span>";
                    }

                    html +=
                        "</div>" +
                        "</span>" +
                        "</div>" +
                        "<div id='menu" +
                        idLocal +
                        "Itens' class='collapse sidebar-submenu'>" +
                        "</div>";
                    ("</div>");

                    if (!document.querySelector("#menu" + idLocal)) {
                        $("#" + pai).append(html);
                    }
                } else if (i == path.length - 1) {
                    id = "";
                    for (var a = 0; a <= i; a++) {
                        id += path[a];
                    }
                    id = id.replace(/\s+/g, "").split(".").join("");

                    pai = "";
                    for (var p = 0; p < i; p++) {
                        pai += path[p];
                    }
                    pai = pai.replace(/\s+/g, "");

                    pai = "menu" + pai + "Itens";

                    html =
                        "<div id='menu" +
                        id +
                        "'>" +
                        "<span href='#' class='list-group-item list-group-item-action bg-dark text-white'";
                    if (funcao == "chamaPagePerso") {
                        html +=
                            "onclick=\"chamaPagePerso('" +
                            caminhoPath +
                            "','" +
                            conteiner +
                            "'," +
                            idJson +
                            ')"';
                    } else {
                        html +=
                            "onclick=\"chamaPage('" +
                            caminhoPath +
                            "','" +
                            conteiner +
                            "')\"";
                    }

                    html += ">";

                    if (Icone) {
                        html += Icone;
                    }

                    html +=
                        "<span class='menu-collapsed texto-menu text-white'>" +
                        path[i] +
                        "</span>" +
                        "</span>" +
                        "</div>";

                    if (!document.querySelector("#menu" + id)) {
                        $("#" + pai).append(html);
                    }
                } else {
                    id = "";
                    for (var a = 0; a <= i; a++) {
                        id += path[a];
                    }
                    id = id.replace(/\s+/g, "");

                    pai = "";
                    for (var p = 0; p < i; p++) {
                        pai += path[p];
                    }
                    pai = pai.replace(/\s+/g, "");

                    pai = "menu" + pai + "Itens";

                    idLocal = path[i].replace(/\s+/g, "").split(".").join("");
                    html =
                        "<div id='menu" +
                        idLocal +
                        "'>" +
                        "<div id='menu" +
                        id +
                        "Label'>" +
                        "<span href='#menu" +
                        id +
                        "Itens' data-toggle='collapse' aria-expanded='false'" +
                        "class='bg-dark list-group-item list-group-item-action seta'>" +
                        "<div class='d-flex align-items-center'>" +
                        "<span class='fa fa-user fa-fw mr-3'></span>" +
                        "<span class='menu-collapsed texto-menu'>" +
                        path[i] +
                        "</span>" +
                        "<span class='fa fa-sort-down ml-auto menu-collapsed'></span>" +
                        "</div>" +
                        "</span>" +
                        "</div>" +
                        "<div id='menu" +
                        id +
                        "Itens' class='collapse sidebar-submenu'>" +
                        "</div>";
                    ("</div>");

                    if (!document.querySelector("#menu" + idLocal)) {
                        $("#" + pai).append(html);
                    }
                }
            }
        }
    });
    $(document).ready(function () {
        setInterval(function () {
            $("#index-login").empty();
        }, 1000);
    });
}
menu();
function chamaPagePerso(path, conteiner, idsublicensa) {
    path = path.split("/");
    $.ajax({
        url: "web/" + path[path.length - 2],
        error: function () {
            $(conteiner).load("web/generico");
        },
        success: function () {
            $(conteiner).load("web/" + path[path.length - 2]);
            $.ajax({
                url: "web/menu/preencheConexao.php",
                dataType: "json",
                data: {
                    idsublicensa: idsublicensa,
                },
                success: function (data) {
                    if (data != false) {
                        $("#nome-conexao").val(data[0].nomeacesso);
                        $("#cpf_cnpj").val(data[0].cpf_cnpj);
                        $("#host").val(data[0].host);
                        $("#porta").val(data[0].porta);
                        $("#nome-banco").val(data[0].nomebanco);
                        $("#user-banco").val(data[0].userbanco);
                        $("#idsublicensa").val(data[0].idsublicensa);
                        $("#senha").val(data[0].senhabanco);
                        $("#ip_externo").val(data[0].ip_externo);

                        $("#nome-conexao").prop("readonly", true);
                        $("#cpf_cnpj").prop("readonly", true);
                        $("#host").prop("readonly", true);
                        $("#porta").prop("readonly", true);
                        $("#nome-banco").prop("readonly", true);
                        $("#user-banco").prop("readonly", true);
                        $("#idsublicensa").prop("readonly", true);
                        $("#senha").prop("readonly", true);
                        $("#ip_externo").prop("readonly", true);

                        $("#novo").val(0);
                        $("#btn-salvar").hide();
                    }
                },
            });
        },
    });
}

function buscaMenu(value) {
    if (value.length <= 2) {
        $("#menu").show();
        $("#buscaMenu").empty();
    } else if (value.length > 2) {
        saida = value.toLowerCase();

        var dados = gets.FPList.filter(function (data) {
            nome = data.MenuPath.toLowerCase().split("/");
            nome = nome[nome.length - 1];
            if (nome.indexOf(saida) != -1) {
                return data;
            }
        });
        if (dados.length > 0) {
            $("#menu").hide();
            $("#buscaMenu").empty();

            for (var i = 0; i < dados.length; i++) {
                path = dados[i].MenuPath.split("/");
                nomeMenu = path[path.length - 1];
                pathMenu = "";
                var funcao = dados[i].Funcao;
                var caminhoPath = dados[i].Path.toLowerCase();
                var menuTexto = dados[i].MenuText;
                var WorkClassType = "dados[i].WorkClassType";
                var classe = "";
                var conteiner = dados[i].conteiner;
                var funcao = dados[i].Funcao;
                var idJson = dados[i].ID;
                for (var d = 0; d < path.length - 1; d++) {
                    pathMenu += path[d] + "/";
                }

                html =
                    "<div id='menu" +
                    id +
                    "'>" +
                    "<a class='list-group-item list-group-item-action bg-dark text-white'";
                if (funcao == "chamaPagePerso") {
                    html +=
                        "onclick=\"chamaPagePerso('" +
                        caminhoPath +
                        "','" +
                        conteiner +
                        "'," +
                        idJson +
                        ')"';
                } else {
                    html +=
                        "onclick=\"chamaPage('" +
                        caminhoPath +
                        "','" +
                        conteiner +
                        "')\"";
                }
                html +=
                    ">" +
                    "<span class='menu-collapsed texto-menu'>" +
                    nomeMenu +
                    "</span>" +
                    "</span>" +
                    "</div>";

                $("#buscaMenu").append(html);
            }
        } else {
            $("#menu").show();
            $("#buscaMenu").empty();
        }
    }
}

$("#button-menu").click(()=>{
    elm = $("#sidebar-container")
    corpo = $("#index-pages")
    if(elm.hasClass("d-none")){
        elm.removeClass("d-none")
        corpo.addClass("d-none")
    }else{
        elm.addClass("d-none")
        corpo.removeClass("d-none")
    }
})