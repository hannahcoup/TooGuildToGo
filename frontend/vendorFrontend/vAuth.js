document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
/** 
  const res = await fetch('http://localhost:5000/vendorFrontend/vendorLogin.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  });

  const data = await res.json();
    if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/vendorFrontend/vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Invalid username or password';
  }
    */
   const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (email === 'v' && password === 'p') {
    localStorage.setItem('token', 'fake-token');
    window.location.href = 'vDashboard.html';
  } else {
    document.getElementById('error').textContent = 'Invalid email or password';
  }
});