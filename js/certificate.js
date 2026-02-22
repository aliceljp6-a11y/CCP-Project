/**
 * Recology Transfer Station — Pledge and certificate
 */
(function () {
  const pledgeCheckboxes = document.querySelectorAll('input[name="pledge"]');
  const btnComplete = document.getElementById('btnCompletePledge');
  const certActions = document.getElementById('certificateActions');
  const certName = document.getElementById('certName');
  const certNamePrint = document.getElementById('certNamePrint');
  const certDatePrint = document.getElementById('certDatePrint');
  const certPledgesPrint = document.getElementById('certPledgesPrint');
  const certEl = document.getElementById('certificate');
  const btnPrint = document.getElementById('btnPrintCert');
  const btnPlayAgain = document.getElementById('btnPlayAgain');

  const pledgeLabels = {
    rinse: 'I will rinse bottles and cans before putting them in recycling.',
    compost: 'I will put food scraps and napkins in the green compost bin.',
    blue: 'I will keep recyclables (paper, plastic, metal, glass) in the blue bin.',
    reusable: 'I will avoid single-use plastics when I can (e.g., use a reusable bottle).',
    lookup: 'I will look up or ask when I\'m not sure where something goes.',
    family: 'I will remind my family to sort our waste at home.',
    school: 'I will use the right bin at school (blue, green, gray).'
  };

  function updateCompleteButton() {
    const checked = document.querySelectorAll('input[name="pledge"]:checked').length;
    btnComplete.disabled = checked < 1;
  }

  pledgeCheckboxes.forEach(cb => cb.addEventListener('change', updateCompleteButton));
  updateCompleteButton();

  btnComplete?.addEventListener('click', () => {
    AppState.setPledgeDone();
    certActions.hidden = false;
    btnComplete.hidden = true;
    const name = (certName && certName.value.trim()) || 'A 4th Grade Ranger';
    certNamePrint.textContent = name;
    certDatePrint.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    certPledgesPrint.innerHTML = '';
    document.querySelectorAll('input[name="pledge"]:checked').forEach(cb => {
      const li = document.createElement('li');
      li.textContent = pledgeLabels[cb.value] || cb.value;
      certPledgesPrint.appendChild(li);
    });
  });

  btnPrint?.addEventListener('click', () => {
    certNamePrint.textContent = (certName && certName.value.trim()) || 'A 4th Grade Ranger';
    certEl.classList.add('visible');
    certEl.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      window.print();
      certEl.classList.remove('visible');
      certEl.setAttribute('aria-hidden', 'true');
    });
  });

  btnPlayAgain?.addEventListener('click', () => {
    window.location.reload();
  });
})();
