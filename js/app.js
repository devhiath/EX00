// OrionHost - JS do formulário de login
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');
const spinner = submitBtn.querySelector('.spinner');
const btnText = submitBtn.querySelector('.btn__text');

document.getElementById('togglePwd').addEventListener('click', () => {
  password.type = password.type === 'password' ? 'text' : 'password';
});

function validate() {
  let ok = true;
  emailError.textContent = '';
  passwordError.textContent = '';
  formMessage.textContent = '';

  if (!email.value.trim()) {
    emailError.textContent = 'Informe seu e‑mail.';
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.textContent = 'E‑mail inválido.';
    ok = false;
  }

  if (!password.value.trim()) {
    passwordError.textContent = 'Informe sua senha.';
    ok = false;
  } else if (password.value.length < 6) {
    passwordError.textContent = 'Mínimo de 6 caracteres.';
    ok = false;
  }
  return ok;
}

function fakeAuth({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allowed = [
        { email: 'demo@orionhost.com', password: '123456' },
        { email: 'gustavo@orionhost.com', password: 'senha123' },
      ];
      const found = allowed.find(u => u.email === email && u.password === password);
      if (found) resolve({ token: 'jwt.fake.token', name: email.split('@')[0] });
      else reject(new Error('Credenciais inválidas.'));
    }, 900);
  });
}

function setLoading(state) {
  spinner.style.display = state ? 'inline-block' : 'none';
  btnText.textContent = state ? 'Entrando...' : 'Entrar';
  submitBtn.disabled = state;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!validate()) return;

  try {
    setLoading(true);
    const data = await fakeAuth({ email: email.value.trim(), password: password.value });
    if (document.getElementById('remember').checked) {
      localStorage.setItem('token', data.token);
    } else {
      sessionStorage.setItem('token', data.token);
    }
    window.location.href = 'dashboard.html';
  } catch (err) {
    formMessage.textContent = err.message || 'Falha ao entrar.';
  } finally {
    setLoading(false);
  }
});
