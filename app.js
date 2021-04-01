class Product {
  constructor(id, name, price, year) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.year = year;
  }
}

//UI Constructor
class UI {
  //Product template
  static addProduct(product) {
    const productList = document.getElementById("product-list");
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="card text-center mb-4">
      <div class="card-body">
      <h5><strong>${product.name}</strong></h5>
      <strong>Price</strong>: ${product.price}€
      <strong>Year</strong>: ${product.year}
      <a href="#" id="${product.id}" onclick="UI.deleteProduct(event)" class="dlt btn btn-danger ml-5" name="delete">Delete</a>
      </div>
      </div>
      `;
    productList.appendChild(element);
  }

  static resetForm() {
    document.getElementById("product-form").reset();
  }

  static deleteProduct(event) {
    console.log("event", event)
    event.target.closest("div.card.text-center.mb-4").remove();

    fetch(`http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/delete-product/ants/${event.target.id}`, {
      method: 'GET',
    })
    .then(res => res.text()) // or res.json()
    .then(res => console.log(res))

    UI.showMessage("Product removed successfully", "danger");
  }

  static showMessage(message, cssClass) {
    const msg = document.createElement("div");
    msg.className = `alert alert-${cssClass} mt-2 text-center`;
    msg.appendChild(document.createTextNode(message));

    //Show in the DOM
    const container = document.querySelector(".container");
    const app = document.querySelector("#app");

    //Insert message in the UI
    container.insertBefore(msg, app);

    //Remove after 2 seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static fetchProducts() {
    fetch('http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/list-products/ants').
      then(response => response.json()).
      then(data => {
        data.forEach(product => {
          if (product.year < 2021) {
            const prdct = new Product(product.id, product.title, product.price, product.year);
            UI.addProduct(prdct);
          }
        })
      });
  }
  // static retreiveAllProductsFromServer() {
  //   fetch(`CHANGAME`, {
  //     method: 'GET', // So, we can specify HTTP Methods here. Uh, interesting.
  //     headers: { 'Content-Type': 'application/json' }, // Type of data to retrieve. 
  //     mode: 'cors', // What is CORS?? https://developer.mozilla.org/es/docs/Web/HTTP/CORS 
  //   })
  // }

  static sendProducts(product) {
    let prd = JSON.stringify({
      'title': product.name,
      'price': product.price,
      'year': product.year
    })

    console.log(typeof prd, prd)
    const response = fetch('http://ec2-35-181-5-201.eu-west-3.compute.amazonaws.com:8080/add-product/ants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: prd
    });
    // return response.json();
  }
}

UI.fetchProducts()

//DOM Events
document.getElementById("product-form").addEventListener("submit", e => {
  var id = ''
  const name = document.getElementById("product-name").value
  price = document.getElementById("product-price").value
  year = document.getElementById("product-year").value

  //Save product
  const product = new Product(id, name, price, year);
  UI.sendProducts(product)
  UI.addProduct(product);
  UI.resetForm();
  UI.showMessage("Product added successfully", "success");

  e.preventDefault();
});
document.getElementById("product-name").addEventListener("input", e=> {
  if(e.target.value.length==20){
    UI.showMessage("Mucho texto", "danger");
  }
});