const registrationsKey = 'ai-income-registrations';
const adminWhatsAppKey = 'ai-income-admin-whatsapp';
const getRegistrations = () => JSON.parse(localStorage.getItem(registrationsKey) || '[]');

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function renderDashboard() {
  const registrations = getRegistrations();
  const today = new Date().toDateString();
  document.querySelector('#total-count').textContent = registrations.length;
  document.querySelector('#today-count').textContent = registrations.filter(item => new Date(item.registeredAt).toDateString() === today).length;
  document.querySelector('#latest-time').textContent = registrations.length ? formatDate(registrations[0].registeredAt) : '—';
  const table = document.querySelector('#registrations-table');
  if (!registrations.length) {
    table.innerHTML = '<p class="empty">No reservations have been recorded yet.</p>';
    return;
  }
  table.innerHTML = `<table><thead><tr><th>Name</th><th>Email</th><th>WhatsApp</th><th>About</th><th>Reserved</th></tr></thead><tbody>${registrations.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.email)}</td><td>${escapeHtml(item.whatsapp)}</td><td>${escapeHtml(item.role)}</td><td>${formatDate(item.registeredAt)}</td></tr>`).join('')}</tbody></table>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

const numberInput = document.querySelector('#admin-whatsapp');
numberInput.value = localStorage.getItem(adminWhatsAppKey) || '';
document.querySelector('#save-whatsapp').addEventListener('click', () => {
  const number = numberInput.value.replace(/\D/g, '');
  const message = document.querySelector('#settings-message');
  if (number.length < 8) {
    message.textContent = 'Enter a valid number with country code.';
    return;
  }
  localStorage.setItem(adminWhatsAppKey, number);
  numberInput.value = number;
  message.textContent = 'WhatsApp number saved.';
});

document.querySelector('#export-csv').addEventListener('click', () => {
  const registrations = getRegistrations();
  const rows = [['Name', 'Email', 'WhatsApp', 'About', 'Reserved at'], ...registrations.map(item => [item.name, item.email, item.whatsapp, item.role, item.registeredAt])];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = 'ai-income-reservations.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

renderDashboard();
