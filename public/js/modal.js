

function editar(id, resp){
fetch(`../PF/editar?id=${id}`,{
    method: "PUT", 
    headers: {
        "Content-Type": "application/json"  },
        body: JSON.stringify(resp)




}).then( response => {
    if(response.ok) {
        return response.json();
}throw new Error("erro de rede")
}).then (dados => { 
    console.log("sucesso", dados)
}).catch (erro => { 
    console.error("erro", erro)
})}







function modal(){


const div = document.createElement("div");

div.id = "perfilSonoro";

resp = {};

  
    
div.innerHTML = `<button id="btn-close" class="btn-fechar">X</button>
        <h2>Editar Perfil Sonoro</h2>
        <label>Gênero</label> <input type="text" id="genero">
        <label>Taxa de popularidade</label> <input type="text" id="taxa">
        <label>Aspecto 1</label> <input type="text" id="aspecto1">
        <label>Aspecto 2</label> <input type="text" id="aspecto2">
        <label>Aspecto 3</label> <input type="text" id="aspecto3">
        <label>Aspecto 4</label> <input type="text" id="aspecto4">
        <button id="btn-salvar" class="btn-salvar">SALVAR</button>
`
document.body.appendChild(div);

const close = document.getElementById("btn-close");
close.onclick = () => {div.remove(); }
const save = document.getElementById("btn-salvar");
save.onclick = () => {
        div.querySelectorAll("input").forEach(campo => {
                let chave = campo.id || campo.name || "campo_sem_nome";
                resp[chave] = campo.value;
              
            });
             gen = resp['genero']
console.log(gen)
id = sessionStorage.ID_USUARIO;
editar(id, resp)
     
    console.log(resp);
   
div.remove(); 

}

}



