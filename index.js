var coresStr = `AliceBlue,AntiqueWhite,Aqua,Aquamarine,Azure,Beige,Bisque,Black,BlanchedAlmond,Blue, BlueViolet,Brown,BurlyWood,CadetBlue,Chartreuse,Chocolate,Coral, CornflowerBlue,Cornsilk,Crimson,Cyan,DarkBlue,DarkCyan,DarkGoldenRod,DarkGray,DarkGrey, DarkGreen,DarkKhaki,DarkMagenta,DarkOliveGreen,DarkOrange,DarkOrchid,DarkRed,DarkSalmon, DarkSeaGreen,DarkSlateBlue,DarkSlateGray,DarkSlateGrey,DarkTurquoise,DarkViolet,DeepPink, DeepSkyBlue,DimGray,DimGrey,DodgerBlue,FireBrick,FloralWhite,ForestGreen,Fuchsia,Gainsboro, GhostWhite,Gold,GoldenRod,Gray,Grey,Green,GreenYellow,HoneyDew,HotPink,IndianRed,Indigo, Ivory,Khaki,Lavender,LavenderBlush,LawnGreen,LemonChiffon,LightBlue,LightCoral,LightCyan, LightGoldenRodYellow,LightGray,LightGrey,LightGreen,LightPink,LightSalmon,LightSeaGreen,LightSkyBlue, LightSlateGray,LightSlateGrey,LightSteelBlue,LightYellow,Lime,LimeGreen,Linen,Magenta,Maroon, MediumAquaMarine,MediumBlue,MediumOrchid,MediumPurple,MediumSeaGreen,MediumSlateBlue,MediumSpringGreen,MediumTurquoise,MediumVioletRed,MidnightBlue,MintCream,MistyRose,Moccasin,NavajoWhite,Navy,OldLace,Olive,OliveDrab,Orange,OrangeRed,Orchid,PaleGoldenRod,PaleGreen,PaleTurquoise,PaleVioletRed,PapayaWhip,PeachPuff,Peru,Pink,Plum,PowderBlue,Purple,RebeccaPurple,Red,RosyBrown,RoyalBlue,SaddleBrown,Salmon,SandyBrown,SeaGreen,SeaShell,Sienna,Silver,SkyBlue,SlateBlue,SlateGray,SlateGrey,Snow,SpringGreen,SteelBlue,Tan,Teal,Thistle,Tomato,Turquoise,Violet,Wheat,White,WhiteSmoke,Yellow,YellowGreen`
var cores = coresStr.split(',')

var coresAleatorioas = []
var corEnigma = '';
var vidas = 2;
var flagFimDeJogo = false;
var flagGanhou = false;
carregarJogo();

function gerarInteiroAleatorio(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - 0)) + 0;
}

function selecionarItemAleatorioNoVetor(vetor) {
    return vetor[gerarInteiroAleatorio(vetor.length)]
}

function selecionarCoresAleatorias(vetorCores, quantidadeCores) {

    var coresAleatorias = []
    for (var i = 0; i < quantidadeCores; i++) {
        var cor = selecionarItemAleatorioNoVetor(vetorCores)

        //verifica se a cor ja est?? no vetor coresAleatorias
        var corBuscada = coresAleatorias.find(function (corBuscada) {
            corBuscada === cor
        })
        while (corBuscada != undefined) {
            console.log(`Cor ${cor} repetida, buscando nova...`)
            cor = selecionarItemAleatorioNoVetor(vetorCores)
        }

        coresAleatorias.push(cor)
    }

    return coresAleatorias;
}

function inserirCoresNaTela(vetorCores) {
    var listaCores = document.querySelector('.lista-cores')

    while (listaCores.firstChild) {
        listaCores.removeChild(listaCores.lastChild);
    }

    for (var cor of vetorCores) {
        var itemLista = document.createElement('li')
        itemLista.textContent = cor
        itemLista.className = 'item-lista'
        itemLista.style.background = cor
        listaCores.append(itemLista)
    }

    var listaElementos = listaCores.querySelectorAll('li')
    for(item of listaElementos){
        adicionarEventsAoItemLista(item);
        adicionarClickEvent(item)
    }
}

function adicionarEventsAoItemLista(item){
    adicionarHoverEvent(item);
}

function adicionarHoverEvent(item){
    let novaCor = item.innerText
        item.addEventListener('mouseover', function(){
            colorirPainelCores(novaCor)
        }, false)
}

function adicionarClickEvent(item){
    let resposta = item.innerText
    item.addEventListener('click', function(){
        verificarResposta(resposta)
    }, false)
}

function carregarJogo() {
    coresAleatorioas = selecionarCoresAleatorias(cores, 10);
    corEnigma = selecionarItemAleatorioNoVetor(coresAleatorioas);
    console.log(`A cor enigma ?? ${corEnigma}`)
    vidas = 2;
    flagFimDeJogo = false;
    flagGanhou = false;
    pintarBackground('white')
    inserirCoresNaTela(coresAleatorioas);
    carregarVidas();
    mensagemConsoleJogo(dicaCorEnigma())
}

function recarregarJogo() {
    console.log('Recarregando jogo...')
    carregarJogo();
}

function carregarVidas() {
    var divCoracores = document.querySelector('.coracao-jogo')
    while (divCoracores.firstChild) {
        divCoracores.removeChild(divCoracores.lastChild);
    }

    for (var i = 0; i < vidas; i++) {
        var coracaoImg = document.createElement('img')
        coracaoImg.src = './public/heart.png'
        divCoracores.append(coracaoImg)
    }
}

function diminuirVida() {
    var divCoracores = document.querySelector('.coracao-jogo')
    if (divCoracores.firstChild) {
        divCoracores.removeChild(divCoracores.lastChild);
    }
}

function verificarResposta(resposta) {

    if(flagFimDeJogo){
        fimDeJogo()
        return
    }

    if (resposta.trim() === '') {
        mensagemConsoleJogo('A resposta n??o pode ser vazia!')
        return
    }

    if (resposta === corEnigma) {
        ganhouJogo()
    } else {
        errouCor(resposta);
    }

}

function ganhouJogo(){
    reproduzirMp3('./public/resposta_certa.mp3')
    mensagemConsoleJogo(`Voc?? acertou! a cor secreta ?? ${corEnigma}. Reinicie o jogo para continuar se divertindo`)
    flagFimDeJogo = true
    flagGanhou = true
    pintarBackground(corEnigma)
}

function pintarBackground(corBg){
    document.querySelector('body').style.background = corBg
}

function errouCor(resposta){
    reproduzirMp3('./public/resposta_errada.mp3')
    vidas--
    diminuirVida();
    if(vidas > 0){
        mensagemConsoleJogo(`${resposta} n??o ?? a cor certa! Tente novamente. ${dicaCorEnigma()}`)
    } else{
        flagFimDeJogo = true
        fimDeJogo()
    }
}

function reproduzirMp3(path){
    var audio = new Audio(path);
    audio.play();
}

function dicaCorEnigma(){
    var posicaoLetra = gerarInteiroAleatorio(corEnigma.length);
    var letraDica = corEnigma[posicaoLetra]
    return `A letra N?? ${posicaoLetra + 1} da cor secreta ?? '${letraDica.toUpperCase()}'`
}

function fimDeJogo() {
    if(!flagGanhou){
        mensagemConsoleJogo(`Voc?? perdeu! a cor enigma era ${corEnigma}. Reinicie o jogo e tente denovo`)
    }
}

function mensagemConsoleJogo(msg) {
    var consoleJogo = document.querySelector('.console-jogo')
    consoleJogo.value = msg
}

function limparConsoleJogo(){
    var consoleJogo = document.querySelector('.console-jogo')
    consoleJogo.value=''
}

function colorirPainelCores(cor){
    var divCor = document.querySelector('.painel-cores')
    divCor.style.background = cor;
}






