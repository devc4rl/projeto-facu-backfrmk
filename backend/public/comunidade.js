function comentar(botao) {
    const input = botao.previousElementSibling;
    const ul = botao.nextElementSibling;
    const texto = input.value.trim();
    if (texto !== "") {
        const li = document.createElement("li");
        li.textContent = texto;
        ul.appendChild(li);
        input.value = "";
    }
}

function doar() {
    document.getElementById("modalDoacao").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalDoacao").style.display = "none";
    document.getElementById("valorDoacao").value = "";
}

function confirmarDoacao() {
    const valor = document.getElementById("valorDoacao").value;
    if (valor && !isNaN(valor) && Number(valor) > 0) {
        fecharModal();
        const mensagem = document.getElementById("mensagemAgradecimento");
        mensagem.style.display = "block";
        setTimeout(() => {
            mensagem.style.display = "none";
        }, 3000);
    } else {
        alert("Digite um valor válido para doar.");
    }
}