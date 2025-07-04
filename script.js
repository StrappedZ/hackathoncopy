// Dropdown menu toggle
function toggleDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest('.dropdown');
  dropdown.classList.toggle('show');
  document.addEventListener('click', function docListener(e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
      document.removeEventListener('click', docListener);
    }
  });
}

// Scroll to section smoothly
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 64,
      behavior: 'smooth'
    });
  }
}

// Carousel highlight animation, hover pause, hey click, and modal
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('#carousel-cards .card');
  const dotsContainer = document.getElementById('carousel-dots');
  let highlighted = 0;
  let carouselInterval = null;

  function updateCarouselHighlight(idx) {
    cards.forEach((c, i) => c.classList.toggle('highlighted', i === idx));
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function createDots(num) {
    dotsContainer.innerHTML = '';
    for(let i=0; i<num; i++){
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.addEventListener('click', () => {
        highlighted = i;
        updateCarouselHighlight(highlighted);
        resetCarouselInterval();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function carouselStep() {
    highlighted = (highlighted + 1) % cards.length;
    updateCarouselHighlight(highlighted);
  }

  function resetCarouselInterval() {
    if(carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(carouselStep, 2500);
  }

  // Pause on hover, "hey click" animation
  cards.forEach((card, idx) => {
    let hoverStart = null;
    card.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
      hoverStart = setTimeout(() => {
        card.classList.add('hey-click');
        setTimeout(() => card.classList.remove('hey-click'), 900);
      }, 2000);
    });
    card.addEventListener('mouseleave', () => {
      resetCarouselInterval();
      if (hoverStart) {
        clearTimeout(hoverStart);
        hoverStart = null;
      }
      card.classList.remove('hey-click');
    });
    card.addEventListener('click', () => {
      showProductModal(card);
    });
  });

  // Modal logic
  const modal = document.getElementById('product-modal');
  const closeModalBtn = document.getElementById('close-modal');

  function showProductModal(card) {
    const data = JSON.parse(card.getAttribute('data-product'));
    // Avatar, name, role, website
    modal.querySelector('.modal-avatar').src = data.profileImg || data.img;
    modal.querySelector('.modal-profile-name').textContent = data.profileName || data.owner || "";
    modal.querySelector('.modal-profile-title').textContent = data.profileRole || "";
    modal.querySelector('.modal-profile-link').textContent = (data.profileWebsite || "").replace(/^https?:\/\//, "");
    modal.querySelector('.modal-profile-link').href = data.profileWebsite || "#";
    // Socials
    const socialsDiv = modal.querySelector('.modal-socials');
    socialsDiv.innerHTML = "";
    (data.socials || []).forEach(s => {
      const a = document.createElement("a");
      a.className = "modal-social";
      a.href = s.url || "#";
      a.target = "_blank";
      const icon = document.createElement("img");
      icon.src = {
        facebook: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
        twitter: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg",
        skype: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/skype.svg"
      }[s.icon] || "";
      icon.alt = s.icon;
      a.appendChild(icon);
      socialsDiv.appendChild(a);
    });
    // Message button (optional: can add event later)
    // Stats
    modal.querySelectorAll('.modal-stat')[0].querySelector('.stat-value').textContent = data.wallets || "0";
    modal.querySelectorAll('.modal-stat')[1].querySelector('.stat-value').textContent = data.income || "0";
    modal.querySelectorAll('.modal-stat')[2].querySelector('.stat-value').textContent = data.transactions || "0";
    // Story
    modal.querySelector('.modal-story-text').value = data.story || "";
    // Verified badge (avatar border)
    if(data.verified) {
      modal.querySelector('.modal-avatar').style.borderColor = "#3cc96e";
    } else {
      modal.querySelector('.modal-avatar').style.borderColor = "#d3d3d3";
    }
    modal.classList.add('active');
  }
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Carousel init
  if(cards.length > 0) {
    createDots(cards.length);
    updateCarouselHighlight(highlighted);
    resetCarouselInterval();
  }

  // Optional: Close dropdown on resize (mobile UX)
  window.addEventListener('resize', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('show'));
  });
});