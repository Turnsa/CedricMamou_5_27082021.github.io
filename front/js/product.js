/*** Récupération URL du produit ***/
const str = window.location.href;
const url = new URL(str);

/*** Récupération ID du produit ***/
const idProduct = url.searchParams.get("id");

 fetch(`http://localhost:3000/api/products/${idProduct}`)

    .then (function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    
    .then (function (value){
        console.log(value)
        document.querySelector(".item__img").innerHTML = `<img src=${value.imageUrl} alt="${value.altTxt}">`
        document.querySelector("#title").innerHTML = `${value.name}`
        document.querySelector("#price").innerHTML = `${value.price.toFixed(2)}`
        document.querySelector("#description").innerHTML = `${value.description}`
        /*** Choix de la couleur ***/
        for (color of value.colors) {
            let productColors = document.createElement("option");
            document.querySelector("#colors").appendChild(productColors);
            productColors.value = color;
            productColors.innerHTML = color;
        }
        /**************** Gestion panier ****************/
      const buttonAddToCart = document.getElementById("addToCart");

      buttonAddToCart.addEventListener('click', event =>{
        /*** Récupération de la quantité et de la couleur du produit ***/
        let selectedQuantity = document.getElementById("quantity").value;
        let selectedColor = document.getElementById("colors").value;
        // let productColor = color.options[color.selectedIndex].text;

        if (selectedQuantity <= 0 || selectedQuantity > 100){
          alert("Veuillez renseingner la quantité SVP")
        }else if (selectedColor == "" ) {
          alert("Veuillez renseingner la couleur SVP")
        } else{

          /*** Ajout d'un popup pour confirmer l'ajout au panier ***/
        const popupConfirmation =() =>{
          if(window.confirm(`Votre commande de ${selectedQuantity} ${document.querySelector("#title").innerHTML} ${selectedColor} est ajoutée au panier
      Pour vous rendre sur la page de votre panier, cliquez sur OK`)){
              window.location.href ="cart.html";
          }
        }

        /*** Sauvegarde du panier ***/
        function saveBasket(basket) {
          localStorage.setItem("basket", JSON.stringify(basket));
        }

        /*** Récupération du panier ***/
        function initBasket(){
          let basket = localStorage.getItem("basket");
          if (basket == null) {
            return [];
          } else {
            return JSON.parse(basket);
          }
        }

        /*** Ajout au panier ***/
        function addBasket(product) {
          let basket = initBasket();
          let resultId = basket.find(element => element.id == product.id);

          if (resultId != undefined){  
            let resultColor = basket.find(element => element.color == product.color);
            if (resultColor != undefined){
              resultColor.quantity = resultColor.quantity + JSON.parse(selectedQuantity) ;
              popupConfirmation();
            }else{
              product.quantity = JSON.parse(selectedQuantity);
              basket.push(product);
              popupConfirmation();
            }  
          /*** Ajout d'un nouveau produit ***/  
          }else{
                product.quantity = JSON.parse(selectedQuantity);
                basket.push(product);
                popupConfirmation();
          }
          saveBasket(basket);
        }    

        addBasket({"id": idProduct, "quantity": selectedQuantity, "color": selectedColor, "name": value.name, "price": value.price, "image": value.imageUrl, "description": value.description, "alttext": value.altTxt});
        }
      });
    })
    .catch (function (err){
    }); 