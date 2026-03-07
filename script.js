document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        entry.target.classList.remove("hidden-initially");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(".hidden-initially");
  elementsToAnimate.forEach((el) => observer.observe(el));

  // sample modal functionality
  const sampleLinks = document.querySelectorAll('.sample-link');
  const modal = document.getElementById('sample-modal');
  const modalClose = document.getElementById('modal-close');
  const sampleFrame = document.getElementById('sample-frame');
  sampleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');
      sampleFrame.setAttribute('src', url);
      modal.classList.remove('hidden');
    });
  });
  modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    sampleFrame.setAttribute('src', '');
  });
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.add('hidden');
      sampleFrame.setAttribute('src', '');
    }
  });
});
