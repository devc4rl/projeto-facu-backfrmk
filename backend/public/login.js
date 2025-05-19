// Função genérica para limpar os campos de um formulário pelo ID
function limparCampos(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    if (formulario) {
        formulario.reset();
    }
}