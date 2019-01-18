function init(){
    localStorage.clear();
    user = new Usuario("admin", "auth&Tasks");
    user.stub();
    tasks = new Tarefa("Lorem Ipsum", "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos. ", "2018-08-01");    
    tasks.stubCreate();
    tasks = new Tarefa("O que é Lorem Ipsum?", "Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica.", "2016-03-03");
    tasks.stubCreate();
    tasks = new Tarefa("De onde ele vem?", "Ao contrário do que se acredita, Lorem Ipsum não é simplesmente um texto randômico. ", "2017-05-08");    
    tasks.stubCreate();
    tasks = new Tarefa("Porque nós o usamos?", "Com mais de 2000 anos, suas raízes podem ser encontradas em uma obra de literatura latina clássica datada de 45 AC. Richard McClintock.", "2019-04-16");    
    tasks.stubCreate();
    tasks = new Tarefa("Onde posso conseguí-lo?", "É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação.", "2018-06-12");    
    tasks.stubCreate();
    window.onload = function(e) {          
        var result = document.getElementById("result");
        result.innerHTML = '<p>Dados Criados com sucesso. Clique em login para acessar a página.</p> <input type="button" value="Login" id="accessLogin" onclick="goToLogin()" />';
    }
}
init();
function goToLogin(){
    window.location.href = 'index.html';
}