
function nameModal(){
    
    document.getElementById("edits").innerHTML= `
        <h2>Edit User Name</h2>
        <input type="text" id="edit-user_name">
        
        <button onclick=saveEditName() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-user_name').value = localStorage.getItem("user_name") || '';
    document.getElementById("feedback").innerHTML = ``
    
    document.getElementById('editModal').style.display = 'block';
};

function passwordModal() {
    document.getElementById("edits").innerHTML = `
        <h2>Change Password</h2>
        <input type="password" id="edit-user_password">
        <button onclick="saveEditPassword()" id="save" class="bagButton">Save</button>
        <hr>
    `;

    document.getElementById('edit-user_password').value = '';
    document.getElementById("feedback").innerHTML = ``;
    document.getElementById('editModal').style.display = 'block';
}

function emailModal(){
    document.getElementById("edits").innerHTML= `
        <h2>Change Email</h2>
        <input type="text" id="edit-user_email">
        <button onclick=saveEditEmail() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-user_email').value = localStorage.getItem("user_email") || '';
    document.getElementById("feedback").innerHTML = ``
    document.getElementById('editModal').style.display = 'block';
};

const editModal = document.getElementById('editModal');
if (document.getElementById('editClose')) {
    document.getElementById('editClose').onclick = () => editModal.style.display = 'none';
    window.onclick = (e) => {
    if (e.target == editModal) editModal.style.display = 'none';

    };
}
async function saveEditName(){
    const new_name = document.getElementById('edit-user_name').value;
    const old_name= localStorage.getItem("user_name");
    const current_id = localStorage.getItem("user_id");
    if(new_name !== old_name){
        const res = await fetch(`https://tooguildtogo.onrender.com/customers/${current_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: document.getElementById('edit-user_name').value
            })
        });
        const data = await res.json();

        if (data.message === 'Setting updated successfully') {
            localStorage.setItem("user_name", new_name);
            document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
        }else{
            document.getElementById("edits").innerHTML= `Error \n`;
        }
    }else{
        document.getElementById("feedback").innerHTML =`
        <p>Invalid: enter a new name</p>`;
    }
}

async function saveEditPassword() {
    const current_id = localStorage.getItem("user_id");
    const new_password = document.getElementById('edit-user_password').value;
    const feedback = document.getElementById("feedback");

    if (!new_password.trim()) {
        feedback.innerHTML = `<p>Enter a new password</p>`;
        return;
    }

    const res = await fetch(`https://tooguildtogo.onrender.com/customers/${current_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: new_password
        })
    });

    const data = await res.json();

    if (data.message === 'Setting updated successfully') {
        feedback.innerHTML = `<p>Saved successfully!</p>`;
    } else {
        feedback.innerHTML = `<p>Error</p>`;
    }
}

async function saveEditEmail(){
    const new_email = document.getElementById('edit-user_email').value;
    const old_email= localStorage.getItem("user_email");
    const current_id = localStorage.getItem("user_id");
    if(new_email !== old_email){
        const res = await fetch(`https://tooguildtogo.onrender.com/customers/${current_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: document.getElementById('edit-user_email').value
            })
        });
        const data = await res.json();

        if (data.message === 'Setting updated successfully') {
            localStorage.setItem("user_email", new_email);
            document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
        }else{
            document.getElementById("edits").innerHTML= `Error \n`;
        }
    }else{
        document.getElementById("feedback").innerHTML =`
        <p>Invalid: enter a new email</p>`;
    }
}

function deleteModal(){
    document.getElementById("edits").innerHTML= `
        <h2>Delete account</h2>
        <p>Enter Password...</p>
        <input type="password" id="password">
        
        <button onclick=deleteAccount() id="save" class="bagButton">Confirm Delete</button> <hr>`;

    
    document.getElementById("feedback").innerHTML = ``
    
    document.getElementById('editModal').style.display = 'block';
}
async function deleteAccount() {
    const current_id = localStorage.getItem("user_id");
    const password = document.getElementById("password").value;
    const feedback = document.getElementById("feedback");

    if (!password.trim()) {
        feedback.textContent = "Please enter your password.";
        return;
    }

    try {
        const res = await fetch("https://tooguildtogo.onrender.com/customers/delete-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: parseInt(current_id),
                password: password
            })
        });

        const data = await res.json();

        console.log("delete account response:", data);

        if (!res.ok) {
            feedback.textContent = data.error || data.detail || "Could not delete account.";
            return;
        }

        if (data.error) {
            feedback.textContent = data.error;
            return;
        }

        if (data.message !== "account deleted successfully") {
            feedback.textContent = "Could not delete account.";
            return;
        }

        localStorage.clear();
        alert("Account deleted successfully.");
        window.location.href = "./index.html";

    } catch (err) {
        console.error("Delete account failed:", err);
        feedback.textContent = "Something went wrong.";
    }
}
