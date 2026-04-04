
/**document.getElementById('loginForm').addEventListener('submit',  (e) => {
  e.preventDefault();

  const res = await fetch('http://localhost:5000/vendorFrontend/vendorLogin.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
      const email= document.getElementById('email').value;
      const password= document.getElementById('password').value;
  //const data = await res.json();
    if (email === 'spudgame@liverpool.ac.uk' && password === 'helloworld') {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('vendor_id', 1);
    localStorage.setItem('vendor_name', 'Spud Game');
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Invalid username or password';
  }
});
*/
  /** 
   const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (email === 'v' && password === 'p') {
    localStorage.setItem('token', 'fake-token');
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Invalid email or password';
  }
});
 Tested version  -- uncomment when mysql ready

*/
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
   
  const res = await fetch('http://127.0.0.1:8000/vendor/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email: email, password: password})
  });

  const data = await res.json();
  
console.log(data.message); // add this
    
  if (data.message == "login successful") {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('vendor_id', data.id);  
    localStorage.setItem('vendor_name', data.name);
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Invalid username or password';
  }
});
