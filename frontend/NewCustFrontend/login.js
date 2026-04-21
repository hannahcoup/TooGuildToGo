const loginForm = document.getElementById('loginForm');
if(loginForm){


    loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const res = await fetch('https://tooguildtogo.onrender.com/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, password: password})
    });

    const data = await res.json();
    
   
        
    if (data.message == "login successful") {
        console.log(data.message); // add this
            console.log("signup response:", data);
console.log("data.id:", data.id);
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user_id', data.user_id);  
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_email', data.user_email);
        window.location.href = './index.html';
    } else {
        document.getElementById('error').textContent = 'Invalid username or password';
    }
    });
}
//users and passwords
/**
 * ('Sarah Wu', 'sarah.wu@liverpool.ac.uk', 'hashed_pw_a'),
('Hussein Shaverdi', 'hussein.shav@liverpool.ac.uk', 'hashed_pw_b'),
('John Doe', 'john.doe@liverpool.ac.uk', 'hashed_pw_c');
all hashed versions of password123
'1a32a8ec087dd4b24265c8ffbb1ede0bdc6a6968cfca00a7b588fd28b23b7422'
 */


//for signup
const signupForm = document.getElementById('signupForm');
if(signupForm){
    signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const confirmPassword= document.getElementById('confirmPassword').value;

    const res = await fetch('https://tooguildtogo.onrender.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: name ,email: email, password: password, confirmPassword: confirmPassword})
        });

        const data = await res.json();
        
        
        if (data.message == "signup successful") {
            localStorage.setItem('token', 'fake-token');
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_name', data.name);
            localStorage.setItem('user_email', data.user_email);
            window.location.href = './index.html';
        } else {
            document.getElementById('error').textContent = 'Invalid username or password';
        }

    });
}
