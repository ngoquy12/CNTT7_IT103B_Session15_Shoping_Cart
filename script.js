// Tạo các dữ liệu quan trọng
const products = [
  { id: 1, name: "Bánh Chưng", price: 150000, img: "/img/banhchung.webp" },
  { id: 2, name: "Giò Lụa", price: 180000, img: "/img/giolua.jpg" },
  { id: 3, name: "Cành Đào", price: 500000, img: "/img/canhdao.webp" },
  { id: 4, name: "Mứt Tết", price: 120000, img: "/img/muttet.webp" },
  { id: 5, name: "Lì Xì (Tệp)", price: 20000, img: "/img/lixi.webp" },
  { id: 6, name: "Dưa Hấu", price: 60000, img: "/img/duahau.jpg" },
];

const carts = [
  {
    id: 1,
    product: {
      id: 1,
      name: "Bánh Chưng",
      price: 150000,
      img: "/img/banhchung.webp",
    },
    quantity: 1,
  },
  {
    id: 2,
    product: { id: 2, name: "Giò Lụa", price: 180000, img: "/img/giolua.jpg" },
    quantity: 2,
  },
];

const productListELement = document.querySelector("#product-list");
const cartListELement = document.querySelector("#cart-list");
const totalPriceElement = document.querySelector("#total-price");

const formatCurrency = (price) => {
  return price.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

const caculatorTotal = (carts) => {
  if (Array.isArray(carts)) {
    const total = carts.reduce((prev, current) => {
      return prev + current.product.price * current.quantity;
    }, 0);

    return total;
  }
};

// Xây dựng các chức năng render dữ liệu
const renderProducts = (products) => {
  // Kiểm tra xem products có phải là mảng?
  if (Array.isArray(products)) {
    let productCardHtml = "";
    products.forEach((product) => {
      productCardHtml += `
         <div class="product-card">
            <img src=${product.img} alt="Hình ảnh của ${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">${formatCurrency(product.price)}</p>
            <button onclick="handleAddToCart(${product.id})" class="btn-add" id="btn-add-${product.id}">
              Thêm vào giỏ
            </button>
        </div>
      `;
    });

    // Gán đoạn mã HTML chứa các sản phẩm ra ngoài giao diện
    productListELement.innerHTML = productCardHtml;
  }
};

// Hiển thị danh sách sản phẩm trong giỏ hàng
const renderCarts = (carts) => {
  if (Array.isArray(carts)) {
    // Kiểm tra xem trong giỏ hàng còn sản phẩm không?
    if (carts.length === 0) {
      // Reset tổng tiền về
      totalPriceElement.textContent = formatCurrency(0);

      cartListELement.innerHTML = `<li class="empty-msg">Chưa có món nào...</li>`;
      return;
    }

    // Render tổng tiền
    totalPriceElement.textContent = formatCurrency(caculatorTotal(carts));

    const cartMaps = carts.map((cart, index) => {
      return `
        <li>
            <span class="cart-item-name">${cart.product.name} (${cart.quantity})</span>
            <button onclick="handleIncreasement(${index})">+</button>
            <button onclick="handleDecreasement(${index})">-</button>
            <div>
              <span class="cart-item-price">${formatCurrency(cart.product.price)}</span>
              <button onclick="handleRemoveItem(${index})" class="btn-remove">X</button>
            </div>
        </li>
      `;
    });

    // Chuyển đổi từ mảng thành chuỗi và dán vào giao diện
    cartListELement.innerHTML = cartMaps.join("");
  }
};

// Hàm thêm sản phẩm vào giỏ hàng
const handleAddToCart = (id) => {
  // Tìm kiếm sản phẩm trong danh sách
  const findProduct = products.find((product) => product.id === id);

  const productIndex = carts.findIndex((cart) => cart.product.id === id);

  if (productIndex === -1) {
    // Nếu chưa có thì tiến hành thêm vào
    // Kiểm tra xem sản phẩm có tồn tại trong danh sách không?
    if (findProduct) {
      // Tạo đối tượng cho cart
      const newCart = {
        id: carts.length + 1,
        product: findProduct,
        quantity: 1,
      };

      // Thêm phần tử newCart và mảng carts
      carts.unshift(newCart);
    } else {
      // + Nếu không sẽ thông báo không tìm thấy
      alert("Không tìm thấy thông tin sản phẩm.");
    }
  } else {
    // Nếu đã có thì tiến hành tăng lên 1
    carts[productIndex].quantity += 1;
  }

  //  + Gọi hàm để xem giao diện mới nhất
  renderCarts(carts);
};

// Hàm xóa sản phẩm khỏi giỏ hàng
const handleRemoveItem = (index) => {
  // Dùng hàm spice để xóa phần tử khỏi mảng
  carts.splice(index, 1);

  // Gọi hàm renderCarts để xem giao diện mới
  renderCarts(carts);
};

//
const handleIncreasement = (index) => {
  // Truy cập vào quantity của sản phẩm trong giỏ hàng theo index
  carts[index].quantity += 1;

  // Gọi lại hàm renderCarts
  renderCarts(carts);
};

const handleDecreasement = (index) => {
  // Lấy ra số lượng hiện tại của sản phẩm trong giỏ hàng
  const currentQuantity = carts[index].quantity;

  if (currentQuantity === 1) {
    handleRemoveItem(index);
  } else {
    // Truy cập vào quantity của sản phẩm trong giỏ hàng theo index
    carts[index].quantity -= 1;

    // Gọi lại hàm renderCarts
    renderCarts(carts);
  }
};

renderProducts(products);

renderCarts(carts);
