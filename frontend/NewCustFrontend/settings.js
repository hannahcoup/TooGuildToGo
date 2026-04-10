
function nameModal(){
    
    document.getElementById("edits").innerHTML= `
        <h2>Edit User Name</h2>
        <input type="text" id="edit-user_name">
        
        <button onclick=saveEditName() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-user_name').value = localStorage.getItem("user_name") || '';
    document.getElementById("feedback").innerHTML = ``
    
    document.getElementById('editModal').style.display = 'block';
};

function passwordModal(){
    document.getElementById("edits").innerHTML= `
        <h2>Change Password</h2>
        <input type="text" id="edit-user_password">
        
        <button onclick=saveEditPassword() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-user_password').value = localStorage.getItem("password") || '';
    document.getElementById("feedback").innerHTML = ``
    document.getElementById('editModal').style.display = 'block';
};

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
        const res = await fetch(`http://127.0.0.1:8000/customers/${current_id}`, {
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

async function saveEditPassword(){
    const current_id = localStorage.getItem("user_id");
    const new_password = document.getElementById('edit-user_password').value;
    const res = await fetch(`http://127.0.0.1:8000/customers/${current_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: new_password
            })
        });
        const data = await res.json();

        if (data.message === 'Setting updated successfully') {
            document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
        }else{
            document.getElementById("edits").innerHTML= `Error \n`;
        }
}

async function saveEditEmail(){
    const new_email = document.getElementById('edit-user_email').value;
    const old_email= localStorage.getItem("user_email");
    const current_id = localStorage.getItem("user_id");
    if(new_email !== old_email){
        const res = await fetch(`http://127.0.0.1:8000/customers/${current_id}`, {
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

async function deleteAccount(){
    const current_id = localStorage.getItem("user_id");
    
}