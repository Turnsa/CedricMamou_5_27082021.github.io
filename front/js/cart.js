let basketStorage = JSON.parse(localStorage.getItem("basket"));
console.table(basketStorage);
// const empty = document.getElementById("items")
// let totalPrice = 0


function displayItem() {
    if (basketStorage === null || basketStorage == 0){
        document.getElementById("cart__items").innerHTML = `<p> Votre pannier est vide<p>`;
    }else {
        for (let product of basketStorage) {
            document.getElementById("cart__items").innerHTML += 
                `<article class="cart__item" data-id=${product.id} data-color=${product.color}>
                <div class="cart__item__img">
                  <img src=${product.image} alt=${product.alttext}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price.toFixed(2)} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
        }
    }
}
displayItem()

/***     prix et quantité total    ***/

function total() {
    let basket = basketStorage;

    let sumQuantity = 0;
    let sumPrice = 0;

    basket.forEach(element => {
        sumQuantity += element.quantity
        sumPrice += element.quantity * element.price;
        document.getElementById("totalQuantity").innerHTML = sumQuantity;
        document.getElementById("totalPrice").innerHTML = sumPrice.toFixed(2);
    });
}
total();

/***    modification article    ***/
function modificationQuantity() {
    let modificationButton = document.querySelectorAll(".itemQuantity");

    for (let i = 0; i < modificationButton.length; i++)
        modificationButton [i].addEventListener("change", (event) => {
            event.preventDefault();

            let quantityToModify = basketStorage[i].quantity;
            let quantityModificationValue = modificationButton[i].valueAsNumber;

            const resultFind = basketStorage.find(el => el.quantityModificationValue !== quantityToModify);
            resultFind.quantity = quantityModificationValue;
            basketStorage[i].quantity = resultFind.quantity;

            localStorage.setItem("basket", JSON.stringify(basketStorage));
            
            total();

            location.reload;
        })       
}
modificationQuantity();

/***    suppression article    ***/
function deleteItem() {
    let deleteButton = document.querySelectorAll(".deleteItem");
    for (let j = 0; j < deleteButton.length; j++)
        deleteButton[j].addEventListener("click", (event) => {
            event.preventDefault();

            let idToDelete = basketStorage[j].id;
            let colorToDelete = basketStorage[j].color;

            basketStorage = basketStorage.filter(el => el.id !== idToDelete || el.color !== colorToDelete);

            localStorage.setItem("basket", JSON.stringify(basketStorage));

            // alert("Le produit a bien été supprimé dun panier.");
            location.reload();
        })
}
deleteItem()



/****************  Partie formulaire  ****************/
const orderButton = document.getElementById("order");

let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAdress =document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");

orderButton.addEventListener ("click", (e) => {
    e.preventDefault();

/***   Récupération des valeurs des inputs du formulaire   ***/
const contact = {
    firstName: inputFirstName.value,
    lastName: inputLastName.value,
    address: inputAdress.value,
    city: inputCity.value,
    email: inputEmail.value
  };

/***   récupération id produits   ***/
const products = basketStorage.map(basket => basket.id);

const order = {
    contact,
    products
}

  validateFirstName(contact.firstName);
  validateLastName(contact.lastName);
  validateAddress(contact.address);
  validateCity(contact.city);
  validateEmail(contact.email);

    if(validateLastName(contact.lastName) && validateFirstName(contact.firstName) && validateAddress(contact.address) && validateCity(contact.city) && validateEmail(contact.email)) {

        /***   Envoi au localStorage   ***/
        fetch("http://localhost:3000/api/products/order", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(order)
        })
            .then (function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then (function (value){
                let orderLink = document.createElement('a');
                orderLink.href = "confirmation.html?id=" + value.orderId;
                window.location.href = orderLink
            })
            .catch (function (err){
            });
    }
})

/***   Déclaration regex    ***/
let charRegex = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegex = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');

/***  Déclaration du message d'erreur   ***/
let error = 'Veuillez renseigner correctement ce champ.';

/***     validation des inputs ou message d'erreur***/
const validateFirstName = (firstName) => {
    if (charRegex.test(firstName)){
        firstNameErrorMsg.innerHTML = "";
        return true
    }else{
        firstNameErrorMsg.innerHTML = error;
    }
}
const validateLastName = (lastName)  => {
    if (charRegex.test(lastName)){
        lastNameErrorMsg.innerHTML = "";
        return true        
    }else{
        lastNameErrorMsg.innerHTML = error;
    }   
}
const validateAddress = (address)  => {
    if (addressRegex.test(address)){
        addressErrorMsg.innerHTML = "";
        return true        
    }else{
        addressErrorMsg.innerHTML = error;
    }       
}
const validateCity = (city)  => {
    if (charRegex.test(city)){
        cityErrorMsg.innerHTML = "";
        return true        
    }else{
        cityErrorMsg.innerHTML = error;
    }
}
const validateEmail = (email)  => {
    if (emailRegex.test(email)){
        emailErrorMsg.innerHTML = "";
        return true    
    }else{
        emailErrorMsg.innerHTML = error;
    }    
}