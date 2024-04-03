const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const chekoutBtn = document.getElementById("chekout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn")

let cart =[];

// Abrir Modal carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
    
})

// Fechar modal

cartModal.addEventListener("click", function(e){
    if(e.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(e){
    let parentButton = e.target.closest(".add-to-cart-btn")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parentButton.getAttribute("data-price")

        addtoCart(name,price)
    }
})

function addtoCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        existingItem.quantity +=1;
    }
    else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }


    updateCartModal()
}


function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemELement =document.createElement("div");
        cartItemELement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemELement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                  Remover
                </button>


            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemELement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}


//Remove item in check

    cartItemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-from-cart-btn")) {
            const name = event.target.getAttribute("data-name")
            removeItemCart(name) 
        }
    })

    function removeItemCart(name) {
        const index = cart.findIndex(item => item.name === name);

        if(index !== -1){
            const item = cart[index];
            
            if(item.quantity > 1){
                item.quantity -= 1;
                updateCartModal();
                return;
            }

            cart.splice(index, 1);
            updateCartModal();
        }
    }

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    if(inputValue !=="") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
chekoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "Ops o restaurante esta fechado 😕",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "rigth", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }



    if (cart.length === 0) return;

    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "38997548204"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`,"_blank")

    cart = [];
    updateCartModal();

})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-500")
    spanItem.classList.add("bg-red-500")
}