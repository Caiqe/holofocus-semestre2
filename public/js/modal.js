

function buscar(){
return fetch(`../PF/buscar`).then( response => {
    if(response.ok) {
        var resposta = response.json();
        return resposta;
}throw new Error("erro de rede")
}).then (dados => { 
    console.log("sucesso", dados);
    return dados;
}).catch (erro => { 
    console.error("erro", erro)
})}




function editar(fk, resp, id){
fetch(`../PF/editar?fk=${fk}&id=${id}`,{
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







function modal(idP){

idP
const div = document.createElement("div");


div.id = "perfilSonoro";

resp = {};

  
    
div.innerHTML = `<button id="btn-close" class="btn-close">X</button>
        <h2>Editar Perfil Sonoro</h2>
        <label>Gênero</label> <select id="genero">carregando...</select>
       <label>Taxa de popularidade</label><br>
Min:
<input type="number" id="taxaMin" min="0" max="100" placeholder="0">

Max:
<input type="number" id="taxaMax" min="0" max="100" placeholder="100">
        <label>Aspecto 1</label> 
        <select id="aspecto1">
  <option value="true">1</option>
  <option value="false">0</option>
</select>
        <label>Aspecto 2</label> 
         <select id="aspecto2">
  <option value="true">1</option>
  <option value="false">0</option>
</select>
        <label>Aspecto 3</label> 
         <select id="aspecto3">
  <option value="true">1</option>
  <option value="false">0</option>
</select>
        <label>Aspecto 4</label> 
         <select id="aspecto4">
  <option value="true">1</option>
  <option value="false">0</option>
</select>
<label>Perfil:</label> <input type="text" id="perfil" value = "PEDA" readonly>
<a href="../public/dashboard/questionario.html">Deseja alterar a sigla do Perfil Sonoro? Clique aqui!</a>>



        <button id="btn-salvar" class="btn-salvar">SALVAR</button>
`



document.body.appendChild(div);

const select = document.getElementById("genero")

buscar().then(res =>{
    var inner = `<br>`
    let id = 0
for(const resp of res){id++
    inner+= `<option value="${id}">${resp.titulo_genero}</option> <br>`

}
select.innerHTML = `${inner}`;

})



const close = document.getElementById("btn-close");
close.onclick = () => {div.remove(); }
const save = document.getElementById("btn-salvar");
save.onclick = () => {
        div.querySelectorAll("input").forEach(campo => {
                let chave = campo.id || campo.name || "campo_sem_nome";
                resp[chave] = campo.value;
       
              
            });
         div.querySelectorAll("select").forEach(sel => {
                let chave = sel.id || sel.name || "sel_sem_nome";
                resp[chave] = sel.value;
               
         });

          resp['aspecto1'] = resp['aspecto1'] === "true" ? 1 : 2;
                resp['aspecto2'] = resp['aspecto2'] === "true" ? 1 : 2;
                resp['aspecto3'] = resp['aspecto3'] === "true" ? 1 : 2;
                resp['aspecto4'] = resp['aspecto4'] === "true" ? 1 : 2;
                resp['genero'] = Number(resp['genero'])
                resp['taxa_min'] = parseFloat(Number(resp['taxaMin']))
                resp['taxa_max'] = parseFloat(Number(resp['taxaMax']))

             gen = resp['genero']
console.log(gen)
fk = sessionStorage.ID_EMPRESA;

 editar(fk, resp, idP);
     console.log('aqui seu objeto')
    console.log(resp);

   
div.remove(); 

}

}



