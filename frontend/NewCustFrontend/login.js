
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
   
  const res = await fetch('http://127.0.0.1:8000/customer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email: email, password: password})
  });

  const data = await res.json();
  
console.log(data.message); // add this
    
  if (data.message == "login successful") {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('customer_id', data.id);  
    localStorage.setItem('customer_name', data.name);
    window.location.href = '/frontend/NewCustFrontend/index.html';
  } else {
    document.getElementById('error').textContent = 'Invalid username or password';
  }
});

//users and passwords
/**
 * ('Sarah Wu', 'sarah.wu@liverpool.ac.uk', 'hashed_pw_a'),
('Hussein Shaverdi', 'hussein.shav@liverpool.ac.uk', 'hashed_pw_b'),
('John Doe', 'john.doe@liverpool.ac.uk', 'hashed_pw_c');
all hashed versions of password123
'1a32a8ec087dd4b24265c8ffbb1ede0bdc6a6968cfca00a7b588fd28b23b7422'
 */