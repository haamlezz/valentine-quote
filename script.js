const api = "http://localhost:3002/products";

// --- 1. ຟັງຊັນສຳລັບສະແດງການແຈ້ງເຕືອນ (Notification) ---
function showNotify(message, type = "success") {
  const notifyDiv = document.getElementById("notification");
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  // ສ້າງ HTML ສຳລັບ Notification
  notifyDiv.innerHTML = `
        <div class="fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl transition-all duration-500 z-50 animate-bounce">
            ${message}
        </div>
    `;

  // ໃຫ້ຫາຍໄປເອງພາຍໃນ 3 ວິນາທີ
  setTimeout(() => {
    notifyDiv.innerHTML = "";
  }, 3000);
}

// --- 2. ດຶງຂໍ້ມູນຈາກ API ---
async function fetchProducts() {
  const loading = document.getElementById("loading");
  loading.innerHTML = `<p class="text-center text-pink-500 font-bold">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>`;

  try {
    const res = await fetch(api);
    if (!res.ok) {
      loading.innerText = `ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ`;
      throw new Error("Error fetching products");
    }
    const products = await res.json();
    loading.innerHTML = ""; // ລ້າງ loading ອອກ
    displayProducts(products);
  } catch (error) {
    showNotify("ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Server ໄດ້", "error");
  }
}

// --- 3. ສະແດງຂໍ້ມູນໃນຕາຕະລາງ ---
function displayProducts(products) {
  const productBody = document.getElementById("product-body");
  productBody.innerHTML = ""; // ລ້າງຂໍ້ມູນເກົ່າອອກກ່ອນ

  products.forEach((p) => {
    const tableRow = document.createElement("tr");
    tableRow.className = "hover:bg-pink-50 transition duration-200"; // ເພີ່ມ hover effect

    tableRow.innerHTML = `
            <td class="py-4 px-6 text-center text-gray-600 font-medium border-b border-pink-50">${p.id}</td>
            <td class="py-4 px-6 text-gray-800 border-b border-pink-50">${p.pro_name}</td>
            <td class="py-4 px-6 text-pink-600 font-bold border-b border-pink-50">${Number(p.price).toLocaleString()} ກີບ</td>
            <td class="py-4 px-6 text-center border-b border-pink-50">
                <span class="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">${p.cat_id}</span>
            </td>
            <td class="py-4 px-6 text-center border-b border-pink-50">
                <div class="flex justify-center gap-3">
                    <button onclick="editProduct(${p.id}, '${p.pro_name}', ${p.price}, ${p.cat_id})" 
                        class="text-amber-500 hover:text-amber-700 font-bold transition">Edit</button>
                    <button onclick="deleteProduct(${p.id})" 
                        class="text-red-500 hover:text-red-700 font-bold transition">Delete</button>
                </div>
            </td>
        `;
    productBody.appendChild(tableRow);
  });
}

// --- 4. ຟັງຊັ້ນເພີ່ມສິນຄ້າໃໝ່ ---
async function addProduct() {
  const pro_name = document.getElementById("pro_name").value;
  const price = document.getElementById("price").value;
  const cat_id = document.getElementById("cat_id").value;

  if (!pro_name || !price) {
    showNotify("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ", "error");
    return;
  }

  try {
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pro_name, price, cat_id }),
    });

    if (res.ok) {
      showNotify("ເພີ່ມສິນຄ້າສຳເລັດແລ້ວ!");
      setTimeout(() => window.location.reload(), 1500); // ລໍຖ້າໃຫ້ຄົນອ່ານ notification ກ່ອນ reload
    } else {
      showNotify("ບໍ່ສາມາດເພີ່ມສິນຄ້າໄດ້", "error");
    }
  } catch (error) {
    showNotify("ເກີດຂໍ້ຜິດພາດທາງລະບົບ", "error");
  }
}

// --- 5. ຟັງຊັ້ນກຽມແກ້ໄຂສິນຄ້າ (ເອົາຄ່າໃສ່ Form) ---
function editProduct(id, pro_name, price, cat_id) {
  document.getElementById("id").value = id;
  document.getElementById("pro_name").value = pro_name;
  document.getElementById("price").value = price;
  document.getElementById("cat_id").value = cat_id;

  // ປ່ຽນສະຖານະປຸ່ມ
  document.getElementById("saveButton").disabled = true;
  document
    .getElementById("saveButton")
    .classList.add("opacity-50", "cursor-not-allowed");
  document.getElementById("updateButton").disabled = false;

  // ເລື່ອນໜ້າຈໍຂຶ້ນໄປຫາ Form
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- 6. ຟັງຊັ້ນປັບປຸງສິນຄ້າ (Update) ---
async function updateProduct() {
  const id = document.getElementById("id").value;
  const updateData = {
    pro_name: document.getElementById("pro_name").value,
    price: document.getElementById("price").value,
    cat_id: document.getElementById("cat_id").value,
  };

  try {
    const res = await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      showNotify("ປັບປຸງສິນຄ້າສຳເລັດ!");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotify("ບໍ່ສາມາດປັບປຸງສິນຄ້າໄດ້", "error");
    }
  } catch (error) {
    showNotify("ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່", "error");
  }
}

// --- 7. ຟັງຊັ້ນລົບສິນຄ້າ ---
async function deleteProduct(id) {
  if (confirm("ທ່ານຕ້ອງການລົບສິນຄ້ານີ້ແທ້ຫຼືບໍ່?")) {
    try {
      const res = await fetch(`${api}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotify("ລົບສິນຄ້າສຳເລັດ!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showNotify("ບໍ່ສາມາດລົບສິນຄ້າໄດ້", "error");
      }
    } catch (error) {
      showNotify("ເກີດຂໍ້ຜິດພາດ", "error");
    }
  }
}

// ເລີ່ມເຮັດວຽກ
fetchProducts();

// ຟັງຊັນ Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginUrl = "http://127.0.0.1:3002/user/login";

  // 1. ກວດສອບຖ້າບໍ່ໃສ່ຂໍ້ມູນ
  if (!email || !password) {
    showNotify("ກະລຸນາປ້ອນ email ແລະ password ໃຫ້ຄົບຖ້ວນ", "error");
    return;
  }

  try {
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // 2. ຖ້າ email ຫຼື password ບໍ່ຖືກ (Server ຕອບກັບ 401)
    if (res.status === 401) {
      showNotify("ກະລຸນາກວດສອບ email ແລະ password ໃຫ້ຖືກຕ້ອງ", "error");
      return;
    }

    // 3. ຖ້າຖືກຕ້ອງ (Server ຕອບກັບ 200)
    if (res.ok) {
      const data = await res.json();

      // ເກັບ accessToken ໄວ້ໃນ localStorage
      localStorage.setItem("accessToken", data.accessToken);

      showNotify("ເຂົ້າສູ່ລະບົບສຳເລັດ!");

      // ໜ່ວງເວລາ 1 ວິນາທີ ແລ້ວໄປໜ້າຈັດການສິນຄ້າ
      setTimeout(() => {
        window.location.href = "index.html"; // ປ່ຽນເປັນຊື່ໄຟລ໌ໜ້າຫຼັກຂອງທ່ານ
      }, 1000);
    } else {
      showNotify("ເກີດຂໍ້ຜິດພາດບາງຢ່າງ ຈາກ Server", "error");
    }
  } catch (error) {
    console.error("Login Error:", error);
    showNotify("ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Server ໄດ້", "error");
  }
}
