const params = window.location.href;
const orderUrl = new URL(params);
// recup orderId dans l'url
const orderId = orderUrl.searchParams.get("id");

document.querySelector("#orderId").innerHTML = orderId;
localStorage.clear();