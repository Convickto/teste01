let responsavelTesouraria = '';
let responsavelOperacoes = '';
let contagemProblemas = {}; // Armazenar contagem dos problemas

// Capturar a submissão do formulário
document.addEventListener('DOMContentLoaded', function () {
    // Solicitar responsáveis uma vez ao carregar a página
    if (!responsavelTesouraria || !responsavelOperacoes) {
        responsavelTesouraria = prompt("Informe o nome do responsável pela Tesouraria:");
        responsavelOperacoes = prompt("Informe o nome do responsável pelas Operações:");
        
        // Exibir os responsáveis acima da tabela
        document.getElementById("responsaveisDisplay").innerHTML = 
            `<h3>Responsável Tesouraria: ${responsavelTesouraria}</h3>
             <h3>Responsável Operações: ${responsavelOperacoes}</h3>`;
    }

    // Definir evento para o botão de envio
    document.getElementById("dataForm").addEventListener("submit", function(event) {
        event.preventDefault();

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
                // Atualizar contagem de problemas
                contagemProblemas[checkbox.value] = (contagemProblemas[checkbox.value] || 0) + 1;
            }
        });
        const itensMarcados = marcados.join(';');

        const tableBody = document.getElementById("tableBody");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `<td>${responsavelTesouraria}</td>
                            <td>${responsavelOperacoes}</td>
                            <td>${rota}</td>
                            <td>${re}</td>
                            <td>${carro}</td>
                            <td>${rua}</td>
                            <td>${horaInicial}</td>
                            <td>${horaFinal}</td>
                            <td>${itensMarcados}</td>
                            <td>${observacoes}</td>`;
        tableBody.appendChild(newRow);

        // Atualizar contagem de problemas
        atualizarContagemProblemas();

        // Resetar o formulário
        document.getElementById("dataForm").reset();
        checkboxes.forEach(checkbox => checkbox.checked = false);
    });

    // Função para atualizar a contagem de problemas
    function atualizarContagemProblemas() {
        let contagemDisplay = "Contagem de Problemas:<br>";
        for (const problema in contagemProblemas) {
            contagemDisplay += `${problema}: ${contagemProblemas[problema]}<br>`;
        }
        document.getElementById("contagemProblemasDisplay").innerHTML = contagemDisplay;
    }

    // Exportar a tabela para Excel
    document.getElementById('exportExcel').addEventListener('click', function() {
        const table = document.getElementById('dataTable');
        const wb = XLSX.utils.table_to_book(table, {sheet: "Sheet 1"});
        XLSX.writeFile(wb, 'registros.xlsx');
    });
});
