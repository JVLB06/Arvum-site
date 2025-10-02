// script.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript carregado!");

    inicializarScroll();
    inicializarTema();
    inicializarAutoFill();
    inicializarGerenciamentoDeGraficos();
    exibirOpcoes();
});
const telasConfig = {"cadastrar_extrato":{nomeCampo: "extrato_cad_hist", valorCampo: "extrato_cad_vlr"}};
/* ============================
        FUNÇÕES MODULARES 
   ============================ */

// 🚀 Scroll automático
function inicializarScroll() {
    const botoes = document.querySelectorAll("nav button");
    if (botoes.length === 0) return;

    botoes.forEach(button => {
        button.addEventListener("click", () => {
            const target = document.querySelector(button.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    console.log("🔹 Scroll automático inicializado.");
}

// 🌙 Alternância entre temas
function inicializarTema() {
    if (localStorage.getItem("tema") === "dark") {
        document.body.classList.add("dark-mode");
    }

    const trocaTemaBtn = document.getElementById("troca_tema");
    if (!trocaTemaBtn) return;

    trocaTemaBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        localStorage.setItem("tema", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    console.log("🔹 Sistema de tema inicializado.");
}

// ✏️ Auto fill
function inicializarAutoFill() {
    const botoesPreenchimento = document.querySelectorAll(".fill-button");
    if (botoesPreenchimento.length === 0) return;

    botoesPreenchimento.forEach(button => {
        button.addEventListener("click", function () {
            let targetId = this.dataset.target;
            let targetInput = document.getElementById(targetId);

            if (targetInput) {
                targetInput.value = this.dataset.value;
                console.log(`✅ Campo ${targetId} preenchido com: ${this.dataset.value}`);
            } else {
                console.error(`⚠️ Elemento com ID '${targetId}' não encontrado!`);
            }
        });
    });

    console.log("🔹 Auto fill inicializado.");
}
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".btn-preencher").forEach(button => {
        button.addEventListener("click", function () {
            // Captura os dados do botão clicado
            let nome = this.getAttribute("data-historico");
            let email = this.getAttribute("data-vlr");

            // Preenche os campos automaticamente
            document.getElementById("extrato_cad_vlr").value = nome;
            document.getElementById("extrato_cad_hist").value = email;
        });
    });
});

// Seleciona os elementos
const gearIcon = document.getElementById("close_btn");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");

// Função para abrir o pop-up
gearIcon.onclick = function() {
    popup.style.display = "block";   // Exibe o pop-up
    overlay.style.display = "block"; // Exibe o fundo escuro
};

// Função para fechar o pop-up
overlay.onclick = function() {
    popup.style.display = "none";  // Esconde o pop-up
    overlay.style.display = "none"; // Esconde o fundo escuro
};

// Gerar opções dinâmicamente
document.addEventListener("DOMContentLoaded", () => {
    // Função para buscar os dados do backend
    fetch("http://localhost:7000")
        .then(response => response.json())
        .then(data => {
            exibirOpcoes(data);
        })
        .catch(error => console.error("Erro ao buscar dados:", error));

    // Função para exibir as opções de auto-fill na tabela
    function exibirOpcoes(dados) {
        const suggestionsTable = document.getElementById("suggestions-table");
        dados.forEach(item => {
            let row = document.createElement("tr");
            let button = document.createElement("button");
            button.type = "button";
            button.classList.add("fill-button");
            button.dataset.value = item.nome; // Nome da opção
            button.dataset.valor = item.valor; // Valor da opção
            button.dataset.historico = item.historico; // Histórico da opção
            button.textContent = item.nome; // Exibe o nome no botão
            row.appendChild(button);
            suggestionsTable.appendChild(row);
        });
    }

    // Função para preencher o formulário com base na opção escolhida
    document.querySelectorAll(".fill-button").forEach(button => {
        button.addEventListener("click", function () {
            const nome = this.dataset.value;
            const valor = this.dataset.valor;
            const historico = this.dataset.historico;

            // Preenche os campos automaticamente
            document.getElementById("extrato_cad_nome").value = nome;
            document.getElementById("extrato_cad_vlr").value = valor;
            document.getElementById("extrato_cad_hist").value = historico;
        });
    });
});


// Bloquear campo
document.addEventListener("DOMContentLoaded", () => {
    const bloquearSim = document.getElementById("bloquear_sim");
    const bloquearNao = document.getElementById("bloquear_nao");
    const valorMaxInput = document.getElementById("investimento_cad_juros");

    // Função para bloquear ou desbloquear o input
    function controlarCampo() {
        if (bloquearSim.checked) {
            valorMaxInput.disabled = true; // Desabilita o campo de número
            valorMaxInput.value = 0; // Define o valor como 0
        } else {
            valorMaxInput.disabled = false; // Habilita o campo de número
            valorMaxInput.value = ""; // Limpa o valor
        }
    }

    // Inicializa o estado com base no botão de rádio selecionado
    controlarCampo();

    // Adiciona os eventos para quando o estado do rádio mudar
    bloquearSim.addEventListener("change", controlarCampo);
    bloquearNao.addEventListener("change", controlarCampo);
});

// Gerar gráfico
function gerarGrafico(dados) {
    const graficoCanvas = document.getElementById("grafico");
    if (!graficoCanvas) return;

    const ctx = graficoCanvas.getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dados.map(item => item.nome),
            datasets: [{
                label: "Valores",
                data: dados.map(item => item.valor),
                backgroundColor: "rgb(201, 162, 39)",
            }]
        }
    });

    console.log("✅ Gráfico gerado.");
}
