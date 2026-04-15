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
  const certEl = document.getElementById('certificate');
  const btnPrint = document.getElementById('btnPrintCert');
  const btnPlayAgain = document.getElementById('btnPlayAgain');

  function updateCompleteButton() {
    const checked = document.querySelectorAll('input[name="pledge"]:checked').length;
    btnComplete.disabled = checked < 1;
  }

  pledgeCheckboxes.forEach(cb => cb.addEventListener('change', updateCompleteButton));
  updateCompleteButton();

  function resolveCertName() {
    return (certName && certName.value.trim()) || 'A 4th Grade Explorer';
  }

  function updateCertificateNamePreview() {
    if (!certNamePrint) return;
    certNamePrint.textContent = resolveCertName();
  }

  certName?.addEventListener('input', updateCertificateNamePreview);
  certName?.addEventListener('change', updateCertificateNamePreview);

  btnComplete?.addEventListener('click', () => {
    AppState.setPledgeDone();
    certActions.hidden = false;
    btnComplete.hidden = true;
    updateCertificateNamePreview();
    if (certDatePrint) {
      certDatePrint.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  });

  btnPrint?.addEventListener('click', () => {
    updateCertificateNamePreview();
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
