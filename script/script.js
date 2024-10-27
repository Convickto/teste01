let chart; // Declarar o gráfico para reutilizá-lo
let responsavelTesouraria = '';
let responsavelOperacoes = '';

// Capturar a submissão do formulário
document.getElementById("dataForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Se os responsáveis não forem preenchidos, capturá-los
    if (!responsavelTesouraria) {
        responsavelTesouraria = document.getElementById("responsavelTesouraria").value;
    }
    if (!responsavelOperacoes) {
        responsavelOperacoes = document.getElementById("responsavelOperacoes").value;

        // Exibir os responsáveis acima da tabela
        document.getElementById("responsaveisDisplay").innerHTML = 
            `<h3>Responsável Tesouraria: ${responsavelTesouraria}</h3>
            <h3>Responsável Operações: ${responsavelOperacoes}</h3>`;
    }

    const rota = document.getElementById("rota").value;
    const re = document.getElementById("re").value;
    const carro = document.getElementById("carro").value;
    const rua = document.getElementById("rua").value;
    const horaInicial = document.getElementById("horaInicial").value;
    const horaFinal = document.getElementById("horaFinal").value;
    const observacoes = document.getElementById("observacoes").value;

    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    let marcados = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            marcados.push(checkbox.value);
        }
    });
    const itensMarcados = marcados.join(';');

    const tableBody = document.getElementById("tableBody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${responsavelTesouraria}</td><td>${responsavelOperacoes}</td><td>${rota}</td><td>${re}</td><td>${carro}</td><td>${rua}</td><td>${horaInicial}</td><td>${horaFinal}</td><td>${itensMarcados}</td><td>${observacoes}</td>`;
    tableBody.appendChild(newRow);

    atualizarGrafico(marcados);
    document.getElementById("dataForm").reset();
    checkboxes.forEach(checkbox => checkbox.checked = false);
});

// Função para atualizar o gráfico
function atualizarGrafico(itensMarcados) {
    const problemas = ["Camera nao funciona", "Pino para fora", "CF fora do patio", "Bateria descarregada", "Bag atrasada"];
    const contagemProblemas = Array(problemas.length).fill(0);

    const linhasTabela = document.querySelectorAll("#dataTable tbody tr");
    linhasTabela.forEach(linha => {
        const colunaItens = linha.cells[8].innerText.split(';');
        colunaItens.forEach(item => {
            const index = problemas.indexOf(item);
            if (index !== -1) {
                contagemProblemas[index]++;
            }
        });
    });

    if (chart) chart.destroy(); // Destruir gráfico anterior, se existir

    const ctx = document.getElementById('chartProblemas').getContext('2d');

    // Criar novo gráfico
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: problemas,
            datasets: [{
                label: 'Ocorrências de Problemas',
                data: contagemProblemas,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Problemas Recorrentes no Carregamento'
                }
            }
        }
    });
}

// Exportar dados da tabela para um arquivo CSV
document.getElementById("exportExcel").addEventListener("click", function() {
    const rows = document.querySelectorAll("#dataTable tr");
    let csvContent = "Responsável Tesouraria;Responsável Operações;Rota;RE;Carro;Rua;Hora Inicial;Hora Final;Itens Marcados;Observações\n";

    rows.forEach((row, index) => {
        if (index === 0) return; // Ignorar a primeira linha (cabeçalho)
        let rowData = [];
        row.querySelectorAll("td").forEach(cell => {
            rowData.push(cell.innerText);
        });
        csvContent += rowData.join(";") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dados_excel.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
