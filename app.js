// 1. let/const — Khai báo biến, không dùng var
const albums = [
    { id: "A01", name: "Born Pink", artist: "BLACKPINK", price: 450000, image: "https://down-vn.img.susercontent.com/file/sg-11134201-22100-5n8id5bsh1iv49@resize_w900_nl.webp" },
    { id: "A02", name: "Proof", artist: "BTS", price: 950000, image: "https://down-vn.img.susercontent.com/file/sg-11134207-7qvft-lgn43nlajrl067@resize_w900_nl.webp" },
    { id: "A03", name: "Get Up", artist: "NewJeans", price: 380000, image: "https://down-vn.img.susercontent.com/file/sg-11134207-7rbk0-lkuh1azyy6au3d@resize_w900_nl.webp" },
    { id: "A04", name: "Armageddon", artist: "aespa", price: 420000, image: "https://down-vn.img.susercontent.com/file/sg-11134201-820lb-mo0n4cpk3rwmcc@resize_w900_nl.webp" }
];

let cartList = [];

// 4. Default parameter — Hàm định dạng giá tiền (mặc định là VNĐ)
const formatPrice = (price, currency = 'VNĐ') => {
    return `${price.toLocaleString('vi-VN')} ${currency}`;
};

// Function to show toast notification
const showToast = (message, type = 'success') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Trigger reflow to apply transition
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300); // Wait for transition to finish
    }, 3000);
};

// Function to show modal notification
const showModal = (message) => {
    const modal = document.getElementById('success-modal');
    const messageEl = document.getElementById('modal-message');
    if (!modal || !messageEl) return;

    messageEl.innerText = message;
    
    // Trigger reflow
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
};

// Add event listener to close modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('success-modal');
            if (modal) modal.classList.remove('show');
        });
    }
});

// 6. Template literal — Render thẻ sản phẩm ra HTML
const renderProducts = () => {
    const productContainer = document.getElementById('product-list');

    const htmlContent = albums.map(album => {
        // 2. Destructuring — Lấy thêm trường 'image'
        const { id, name, artist, price, image } = album;

        return `
            <div class="product-card">
                <div style="overflow: hidden; border-radius: 12px; margin-bottom: 15px;">
                    <img src="${image}" alt="Album ${name}" class="product-img">
                </div>
                <div class="product-info">
                    <h3>${name}</h3>
                    <p class="artist">Nghệ sĩ: <strong>${artist}</strong></p>
                    <p class="price">${formatPrice(price)}</p>
                    <button class="btn-add" onclick="addToCart('${id}')">Thêm vào giỏ</button>
                </div>
            </div>
        `;
    }).join('');

    productContainer.innerHTML = htmlContent;
};

// 5. Arrow function — Hàm xử lý sự kiện thêm vào giỏ hàng
const addToCart = (productId) => {
    const selectedAlbum = albums.find(album => album.id === productId);
    if (selectedAlbum) {
        cartList.push(selectedAlbum);
        renderCart();
        showToast(`Đã thêm ${selectedAlbum.name} vào giỏ hàng!`, 'success');
    }
};

// 5. Arrow function — Hàm xử lý sự kiện xóa khỏi giỏ hàng
const removeFromCart = (index) => {
    cartList.splice(index, 1);
    renderCart();
};

// 3. Rest parameter — Hàm tính tổng tiền giỏ hàng (nhận vào vô số tham số giá tiền)
const calculateTotalPrice = (...prices) => {
    return prices.reduce((total, currentPrice) => total + currentPrice, 0);
};

const renderCart = () => {
    const cartContainer = document.getElementById('cart-items');

    // 7. Enhanced object literal — Tạo object giỏ hàng ngắn gọn
    const cartData = {
        cartList, // Tương đương cartList: cartList
        getTotal() { // Khai báo method ngắn gọn, không cần function keyword
            // Trích xuất mảng các mức giá từ giỏ hàng
            const pricesArray = this.cartList.map(item => item.price);
            // Dùng Spread operator (...) để truyền mảng vào Rest parameter của hàm tính tổng
            return calculateTotalPrice(...pricesArray);
        }
    };

    // Render HTML cho giỏ hàng
    cartContainer.innerHTML = cartData.cartList.map((item, index) => {
        const { name, price } = item; // Destructuring lần nữa
        return `
            <li>
                <div class="cart-item-info">
                    <span class="cart-item-title">${name}</span>
                    <span class="cart-item-price">${formatPrice(price)}</span>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">Xóa</button>
            </li>
        `;
    }).join('');

    // Cập nhật tổng tiền
    document.getElementById('total-price').innerText = formatPrice(cartData.getTotal());
};

// 8. Promise (.then/.catch) — Mô phỏng gọi API đặt hàng
const callOrderAPI = () => {
    return new Promise((resolve, reject) => {
        const checkoutButton = document.getElementById('checkout-btn');
        checkoutButton.innerText = "Đang xử lý...";

        setTimeout(() => {
            checkoutButton.innerText = "Đặt hàng ngay";
            if (cartList.length > 0) {
                resolve("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua Album.");
            } else {
                reject("❌ Giỏ hàng đang trống. Hãy chọn một vài Album trước khi đặt hàng nhé!");
            }
        }, 1500); // Giả lập độ trễ mạng 1.5 giây
    });
};

// Bắt sự kiện click đặt hàng
document.getElementById('checkout-btn').addEventListener('click', () => {
    callOrderAPI()
        .then((successMessage) => {
            showModal(successMessage);
            cartList = []; // Xóa giỏ hàng sau khi đặt thành công
            renderCart();
        })
        .catch((errorMessage) => {
            showToast(errorMessage, 'error');
        });
});

// Khởi chạy khi load trang
renderProducts();