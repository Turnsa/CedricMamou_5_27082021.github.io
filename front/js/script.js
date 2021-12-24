fetch("http://localhost:3000/api/products")

    .then (function (res) {
        if (res.ok) {
            return res.json();
        }
    })

    .then (function (item) {
        // let items = document.querySelector(".items");
        item.forEach(element => {
            console.table(element);
            document.querySelector(".items").innerHTML +=   `<a href="./product.html?id=${element._id}">
                                                                <article>
                                                                    <img src=${element.imageUrl} alt="${element.altTxt}">
                                                                    <h3 class="productName">${element.name}</h3>
                                                                    <p class="productDescription">${element.description}</p>
                                                                </article>
                                                            </a>`
        });
    })

    .catch (function (err){
});