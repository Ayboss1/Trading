const form = document.querySelector('#registration-form');
const message = document.querySelector('.form-message');
document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    message.textContent = 'Please add your name, a valid email address, and WhatsApp number.';
    form.reportValidity();
    return;
  }
  const registration = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    whatsapp: form.elements.whatsapp.value.trim(),
    role: form.elements.role.value || 'Not specified',
    registeredAt: new Date().toISOString()
  };
  const registrations = JSON.parse(localStorage.getItem('ai-income-registrations') || '[]');
  registrations.unshift(registration);
  localStorage.setItem('ai-income-registrations', JSON.stringify(registrations));

  const adminWhatsApp = (localStorage.getItem('ai-income-admin-whatsapp') || '').replace(/\D/g, '');
  if (!adminWhatsApp) {
    message.textContent = 'Your seat is reserved. The organiser will contact you shortly.';
    return;
  }

  const chatMessage = `Hello, I would like to reserve my seat for The AI Income Opportunity™ masterclass.\n\nName: ${registration.name}\nEmail: ${registration.email}\nWhatsApp: ${registration.whatsapp}\nAbout me: ${registration.role}`;
  message.textContent = 'Your details have been saved. Opening WhatsApp…';
  window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(chatMessage)}`, '_blank', 'noopener');
});
