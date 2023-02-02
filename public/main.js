const socket = io();
let flag = false;

const form = document.getElementById("formMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = {
    author: {
      id: document.getElementById("email").value,
      name: document.getElementById("name").value,
      lastname: document.getElementById("lastname").value,
      age: document.getElementById("age").value,
      nickname: document.getElementById("nickname").value,
      avatar: document.getElementById("avatar").value,
    },
    text: document.getElementById("text").value,
  };

  document.getElementById("text").value = "";

  console.log(message);

  socket.emit("new-message", message);
});

socket.on("products", (data) => {
  if (data.length !== 0) {
    const productList = document.getElementById("productList");
    const notProducts = document.getElementById("notProducts");
    productList.classList.remove("d-none");
    notProducts.classList.add("d-none");
    flag = true;
  }
  let html = "";
  data.forEach((product) => {
    html += `
    <tr>
      <th scope="row">${product.id}</th>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td><img src=${product.thumbnail} alt=${product.name}} style="height: 50px; width: 50px;"></td>
    </tr>
    `;
  });
  document.getElementById("productTable").innerHTML = html;
});

socket.on("product-added", (product) => {
  if (!flag && product.id) {
    const productList = document.getElementById("productList");
    const notProducts = document.getElementById("notProducts");
    productList.classList.remove("d-none");
    notProducts.classList.add("d-none");
    flag = true;
  }

  let html = document.getElementById("productTable").innerHTML;
  html += `
  <tr>
    <th scope="row">${1}</th>
    <td>${product.name}</td>
    <td>$${product.price}</td>
    <td><img src=${product.thumbnail} alt=${
    product.name
  }} style="height: 50px; width: 50px;"></td>
  </tr>
  `;

  document.getElementById("productTable").innerHTML = html;
});

const sendProduct = (that) => {
  const product = {
    name: that.name.value,
    price: that.price.value,
    thumbnail: that.thumbnail.value,
  };

  socket.emit("new-product", product);
};

socket.on("messages", (data) => {
  let html = "";
  data.forEach((message) => {
    html += `
    <p>
      <b style="color: blue">${message.author.id}</b>
      <span style="color: brown">[ ${message.date} ]</span> 
      : 
      <i style="color: green">${message.text}</i>
    </p>
    `;
  });

  document.getElementById("messages").innerHTML = html;
});

socket.on("message-added", (message) => {
  let html = document.getElementById("messages").innerHTML;
  html += `
  <p>
    <b style="color: blue">${message.author.id}</b>
    <span style="color: brown">[ ${message.date} ]</span> 
    : 
    <i style="color: green">${message.text}</i>
  </p>
  `;

  document.getElementById("messages").innerHTML = html;
});
