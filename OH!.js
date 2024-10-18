// Função para traduzir tipos e atributos
const translate = {
    'Attribute': {
        'DARK': 'Trevas',
        'LIGHT': 'Luz',
        'WIND': 'Vento',
        'WATER': 'Água',
        'FIRE': 'Fogo',
        'EARTH': 'Terra'
    },
    'Type': {
        'Spell Card': 'Carta Mágica',
        'Trap Card': 'Carta Armadilha',
        'Normal Monster': 'Monstro Normal',
        'Effect Monster': 'Monstro de Efeito',
        'Fusion Monster': 'Monstro de Fusão',
        'Synchro Monster': 'Monstro Sincro',
        'XYZ Monster': 'Monstro XYZ'
    }
};

const cardImage = document.getElementById('cardImage');
const cardName = document.getElementById('cardName');
const cardDesc = document.getElementById('cardDesc');
const cardAttribute = document.getElementById('cardAttribute');
const cardType = document.getElementById('cardType');
const cardLevel = document.getElementById('cardLevel');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
const searchInput = document.getElementById('searchInput');
const carouselInfo = document.querySelector('.carousel-info');
const readMoreBtn = document.getElementById('readMoreBtn');

let cardData = [];
let currentIndex = 0;
let isDescriptionExpanded = false; // Variável para controlar a expansão da descrição

// Função para buscar dados da API
async function fetchCardData() {
    try {
        const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
        const data = await response.json();
        cardData = data.data; // Dados da API
        updateCard(currentIndex);
        updatePageInfo();
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Função para atualizar a carta exibida
function updateCard(index) {
    const card = cardData[index];

    // Atualiza a carta e reinicia o fade-in
    cardImage.style.opacity = '0';
    carouselInfo.classList.remove('fade-in');

    setTimeout(() => {
        cardImage.src = card.card_images[0].image_url;
        cardName.textContent = card.name;
        cardDesc.textContent = card.desc;
        cardAttribute.textContent = translate['Attribute'][card.attribute] || card.attribute;
        cardType.textContent = translate['Type'][card.type] || card.type;
        cardLevel.textContent = card.level ? card.level : 'N/A';

        // Adiciona lógica para o botão "Ler mais"
        if (card.desc.length > 100) {
            cardDesc.textContent = card.desc.substring(0, 100) + '...'; // Mostra um resumo
            readMoreBtn.style.display = 'block'; // Exibe o botão "Ler mais"
        } else {
            readMoreBtn.style.display = 'none'; // Esconde o botão se a descrição for curta
        }

        carouselInfo.classList.add('fade-in');
        cardImage.style.opacity = '1'; // Transição suave
    }, 500);
}

// Atualiza as informações da página
function updatePageInfo() {
    pageInfo.textContent = `${currentIndex + 1} de ${cardData.length}`;
}

// Navegação para a página anterior
prevPageBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard(currentIndex);
        updatePageInfo();
    }
});

// Navegação para a próxima página
nextPageBtn.addEventListener('click', () => {
    if (currentIndex < cardData.length - 1) {
        currentIndex++;
        updateCard(currentIndex);
        updatePageInfo();
    }
});

// Função para mostrar a descrição completa
readMoreBtn.addEventListener('click', () => {
    const card = cardData[currentIndex];
    if (!isDescriptionExpanded) {
        cardDesc.textContent = card.desc; // Mostra a descrição completa
        readMoreBtn.textContent = 'Ler menos'; // Altera o texto do botão
    } else {
        cardDesc.textContent = card.desc.substring(0, 100) + '...'; // Resumo novamente
        readMoreBtn.textContent = 'Ler mais'; // Altera o texto do botão
    }
    isDescriptionExpanded = !isDescriptionExpanded; // Alterna o estado
});

// Evento de digitação na barra de pesquisa
searchInput.addEventListener('input', filterCards);

// Função para filtrar cartas em tempo real
function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCards = cardData.filter(card => card.name.toLowerCase().includes(searchTerm));

    if (filteredCards.length > 0) {
        currentIndex = 0; // Reseta o índice ao buscar
        cardData = filteredCards; // Atualiza os dados para as cartas filtradas
        updateCard(currentIndex);
        updatePageInfo();
    } else {
        // Limpa a informação da carta se não houver correspondência
        cardImage.src = '';
        cardName.textContent = 'Carta não encontrada';
        cardDesc.textContent = '';
        cardAttribute.textContent = '';
        cardType.textContent = '';
        cardLevel.textContent = '';
        pageInfo.textContent = '0 de 0';
        readMoreBtn.style.display = 'none'; // Esconde o botão ao não encontrar
    }
}

// Inicializa a busca de dados
fetchCardData();
