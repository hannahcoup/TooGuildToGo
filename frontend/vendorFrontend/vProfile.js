let bags = [];

/**need to wait for reservation backend route to work - currently bags is returning as a view for available bags so wont filter for 
 * bags that are collected. reservations will actually have statuses soo will be better to use
 */
async function loadBags() {
  const vendor_name = localStorage.getItem('vendor_name');
  console.log(vendor_name);
  
  const res = await fetch(`http://127.0.0.1:8000/bags`);
  const data = await res.json();
  let allBags = data;
  bags = allBags.filter(b => b.vendor_name === vendor_name);

    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]'); 

    //getting numbers for each status 
    const bagsSold = bags.filter(b => b.status === 'collected').length;
    console.log(bags);
    const bagsReserved = bags.filter(b => b.status === 'reserved').length;
    const bagsAvailable = bags.filter(b => b.status === 'available').length;

    const upcomingRes = reservations.filter(r => r.status === 'reserved').length;
    const meals_sold_overall = reservations.length;

    const today = new Date().toDateString();
    const meals_sold_today =  bags.filter(r => r.status === 'collected' && new Date(r.pickup_window_end).toDateString() ===  today).length;

    if(document.getElementById("info")){
        document.getElementById("info").innerHTML = `
        <h2> ${localStorage.getItem('vendor_name')}'s Profile Summary: </h2>`;
    }
    document.getElementById("bags_sold").innerHTML = `${bagsSold}`;
    document.getElementById("bags_reserved").innerHTML = `${bagsReserved}`;
    document.getElementById("bags_available").innerHTML = `${bagsAvailable}`;
    document.getElementById("bags_upcoming").innerHTML = `${upcomingRes}`;

    document.getElementById("meals_sold_today").innerHTML = `${meals_sold_today}`;
    document.getElementById("meals_sold_overall").innerHTML = `${meals_sold_overall}`;
}
loadBags();
//settings page 
function nameModal(){
    
    document.getElementById("edits").innerHTML= `
        <h2>Edit Vendor Name</h2>
        <input type="text" id="edit-vendor_name">
        
        <button onclick=saveEditName() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-vendor_name').value = localStorage.getItem("vendor_name") || '';
    document.getElementById("feedback").innerHTML = ``
    
    document.getElementById('editModal').style.display = 'block';
};

function passwordModal(){
    document.getElementById("edits").innerHTML= `
        <h2>Edit Vendor Password</h2>
        <input type="text" id="edit-vendor_password">
        
        <button onclick=saveEditPassword() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-vendor_password').value = localStorage.getItem("vendor_password") || '';
    document.getElementById("feedback").innerHTML = ``
    document.getElementById('editModal').style.display = 'block';
};

function emailModal(){
    document.getElementById("edits").innerHTML= `
        <h2>Edit Vendor Email</h2>
        <input type="text" id="edit-vendor_email">
        <button onclick=saveEditEmail() id="save" class="bagButton">Save</button> <hr>`;

    document.getElementById('edit-vendor_email').value = localStorage.getItem("vendor_email") || '';
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
function saveEditName(){
    const new_name = document.getElementById('edit-vendor_name').value;
    const old_name= localStorage.getItem("vendor_name");
    if(new_name !== old_name){
        localStorage.setItem("vendor_name", new_name);
        document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
    }else{
        document.getElementById("feedback").innerHTML =`
        <p>Invalid: enter a new name</p>`;
    }
}

function saveEditPassword(){
    const new_password = document.getElementById('edit-vendor_password').value;
    const old_password= localStorage.getItem("vendor_password");
    if(new_password !== old_password){
        localStorage.setItem("vendor_passwor", new_password);
        document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
    }else{
        document.getElementById("feedback").innerHTML =`
        <p>Invalid: enter a new password</p>`;
    }
}

function saveEditEmail(){
    const new_email = document.getElementById('edit-vendor_email').value;
    const old_email= localStorage.getItem("vendor_email");
    if(new_email !== old_email){
        localStorage.setItem("vendor_email", new_email);
        document.getElementById("edits").innerHTML= `Saved Successfully! \n`;
    }else{
        document.getElementById("feedback").innerHTML =`
        <p>Invalid: enter a new email</p>`;
    }
}