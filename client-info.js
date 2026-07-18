document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("clientForm");
    const phoneInput = document.getElementById("phone");
        if (phoneInput) {
            phoneInput.addEventListener("input", function () {
                // Remove anything that is not a number
                let numbers = this.value.replace(/\D/g, "");
                // Limit to 10 digits
                numbers = numbers.substring(0, 10);
                // Add dashes automatically
                if (numbers.length > 6) {
                    this.value = numbers.replace(
                        /(\d{3})(\d{3})(\d{1,4})/,
                        "$1-$2-$3"
                    );
                } else if (numbers.length > 3) {
                    this.value = numbers.replace(
                        /(\d{3})(\d+)/,
                        "$1-$2"
                    );
                } else {
                    this.value = numbers;
                }
            });
}
    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        // 🧾 package data
        // 🧾 package data
        const packageName = localStorage.getItem("package_name");
        const totalPrice = localStorage.getItem("package_price");
        const depositAmount = localStorage.getItem("deposit_amount");

        // 👤 client data (YOU WERE MISSING THIS PART)
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const business = document.getElementById("business").value;

        // 🔑 generate order id
        const orderId = "AMPX" + Math.random().toString(36).substring(2, 10).toUpperCase();

        console.log("Order ID:", orderId);

       // 💾 store for later pages
            localStorage.setItem("order_id", orderId);

            localStorage.setItem("client_name", name);
            localStorage.setItem("client_email", email);
            localStorage.setItem("client_phone", phone);
            localStorage.setItem("business_name", business);

            localStorage.setItem("package_name", packageName);
            localStorage.setItem("package_price", totalPrice);
            localStorage.setItem("deposit_amount", depositAmount);

        // 🧾 show review (temporary for now)
        

        // 🚀 NEXT STEP (we will replace this with Supabase + Stripe redirect)
        window.location.href = "review-order.html";
    });

});

        
