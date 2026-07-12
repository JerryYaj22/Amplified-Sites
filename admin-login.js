const client = window.supabaseClient;
async function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const { data: attempt } = await client
        .from("login_attempts")
        .select("*")
        .eq("email", email)
        .maybeSingle();
    if (attempt && attempt.failed_count >= 5) {
        document.getElementById("error").innerText =
            "Account locked due to too many failed attempts.";
        document.getElementById("error").style.display = "block";
        return;
    }
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        if (attempt) {
            await client
                .from("login_attempts")
                .update({
                    failed_count: attempt.failed_count + 1,
                    last_attempt: new Date()
                })
                .eq("email", email);
        } else {
            await client
                .from("login_attempts")
                .insert({
                    email,
                    failed_count: 1,
                    last_attempt: new Date()
                });
        }
        document.getElementById("error").innerText = error.message;
        document.getElementById("error").style.display = "block";
        return;
    }
    await client
        .from("login_attempts")
        .delete()
        .eq("email", email);
    window.location.href = "admin-dashboard.html";
}
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});