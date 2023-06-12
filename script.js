let cart = [];
let modalQT = 1;
let modalKey = 0;


// função criada para retornar o querySelector. Isso irá simplificar a sua utilização.

const c = (el) =>  document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem dos hamburgueres

burgerJson.map((item, index) =>{
    let burgerItem = c('.models .burger-item').cloneNode(true);
    // preencher as informações em burger-item

    // definindo um parâmetro na div para diferenciá-las
    burgerItem.setAttribute('data-key', index);

    //substituindo o nome dos hamburgueres
    burgerItem.querySelector('.burger-item--img img').src = item.img;
    burgerItem.querySelector('.burger-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    burgerItem.querySelector('.burger-item--name').innerHTML = item.name;
    burgerItem.querySelector('.burger-item--desc').innerHTML = item.description;
    burgerItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();
        let key = e.target.closest('.burger-item').getAttribute('data-key');
        modalQT = 1;
        modalKey = key;

    //incluindo descrição dos itens na drawer
        c('.burgerBig img').src = burgerJson[key].img;
        c('.burgerInfo h1').innerHTML = burgerJson[key].name;
        c('.burgerInfo--desc').innerHTML = burgerJson[key].description;
        c('.burgerInfo--actualPrice').innerHTML = `R$ ${burgerJson[key].price.toFixed(2)}`;


        

    // selecionando e inserindo os "acréscimos". Utilizando o querySelectorAll
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = burgerJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQT; 

        
    // configuração para o modal abrir com efeito opacidade
        c('.burgerWindowArea').style.opacity = 0;
        c('.burgerWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.burgerWindowArea').style.opacity = 1;
        }, 200);

    });


    c('.burger-area').append( burgerItem );

});

// Eventos do modal

function closeModal() {
    c('.burgerWindowArea').style.opacity = 0;
    setTimeout( () => {

        c('.burgerWindowArea').style.display = 'none';
    
    }, 500)
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Diminuindo a quantidade de items
c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(modalQT > 1){
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT;
    
    }
});


// Aumentando a quantidade de items
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT; 
});

// Selecionando e acrescentando os valores das batatas

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {

        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    // criando o identificador para adicionar outras quantidades de hamburgueres e visualizá-las no carrinho separadamente
    let identifier = burgerJson[modalKey].id+'@'+size;

    let key = cart.findIndex(( item ) => item.identifier == identifier);

        if(key > -1) {
            cart[key].qt += modalQT;
        } else {
            cart.push({
                identifier,
                id:burgerJson[modalKey].id,
                size,
                qt:modalQT
            });        
        }

    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0 ) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        if (c('aside').classList.contains('show')){
            c('.burger-area').classList.add('burger-area-form');
        }

        // variáveis para cálculo de custo total, desconto e etc
        let subtotal = 0;
        let desconto = 0;
        let total = 0;





        for(let i in cart) {
            
            let burgerItem = burgerJson.find((item) => item.id == cart[i].id);
            subtotal += burgerItem.price * cart[i].qt;



            let cartItem = c('.models .cart--item').cloneNode(true);

            let burgerSizeName;
            switch(cart[i].size) {
                case 0:
                    burgerSizeName = 'c/ Batata pequena';
                    break;

                case 1:
                    burgerSizeName = 'c/ Batata Média';
                    break;

                case 2:
                    burgerSizeName = 'c/ Batata Grande';
                    break;
            }
            let burgerName = `${burgerItem.name} (${burgerSizeName})`;


            cartItem.querySelector('img').src = burgerItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = burgerName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            // removendo items no carrinho do modal
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            // adicionando items no carrinho do modal
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal *0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');
        c('.burger-area').classList.remove('burger-area-form');
        
}}

