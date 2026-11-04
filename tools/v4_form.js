{
  const form = $('#demoForm'), note = $('#formNote');
  const RULES = { name: v => v.trim() ? '' : 'Please add your name.', email: v => !v.trim() ? 'Please add your work email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, like name@company.com.' };
  function check(input) {
    const err = RULES[input.name](input.value), label = input.closest('label');
    let msg = label.querySelector('.ferr');
    if (err && !msg) { msg = document.createElement('small'); msg.className = 'ferr'; msg.id = 'err-' + input.name; msg.setAttribute('role', 'alert'); label.appendChild(msg); }
    if (msg) msg.textContent = err;
    if (!err && msg) msg.remove();
    input.toggleAttribute('aria-invalid', !!err);
    if (err) input.setAttribute('aria-describedby', 'err-' + input.name); else input.removeAttribute('aria-describedby');
    return !err;
  }
  Object.keys(RULES).forEach(n => { const i = form.elements[n]; i.addEventListener('input', () => { if (i.hasAttribute('aria-invalid')) check(i); note.textContent = ''; }); i.addEventListener('blur', () => { if (i.value) check(i); }); });
  form.addEventListener('submit', e => {
    e.preventDefault(); note.textContent = '';
    const bad = Object.keys(RULES).map(n => form.elements[n]).filter(i => !check(i));
    if (bad.length) { bad[0].focus(); return; }
    if (!CONTACT_EMAIL) { note.textContent = 'Demo booking opens soon. This preview is not taking requests yet.'; return; }
    const f = new FormData(form), body = `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nCompany: ${f.get('company')}\nIndustry: ${f.get('industry')}\n\n${f.get('msg')}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Northstar demo request')}&body=${encodeURIComponent(body)}`;
  });
}
