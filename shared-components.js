// Shared Web Components for The Wilder House
// Reduces code duplication across 30+ pages

class SharedHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<nav aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="logo"><span class="logo-name">The Wilder House</span><em class="logo-est">Est. 1898</em></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="/">Home</a></li>
      <li><a href="/#suites">Our Suites</a></li>
      <li><a href="savannah-victorian-district">Location</a></li>
      <li><a href="reviews">Reviews</a></li>
      <li><a href="contact">Contact</a></li>
      <li><a href="savannah-day-planner">Live Planner</a></li>
      <li><a href="/#suites" class="nav-cta">Book Now</a></li>
    </ul>
    <button class="nav-toggle" id="navToggle" aria-label="Open navigation" aria-expanded="false" aria-controls="navLinks">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>
</nav>`;
    this.initMobileNav();
  }

  initMobileNav() {
    const toggle = this.querySelector('#navToggle');
    const links = this.querySelector('#navLinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
      });
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
}

class SharedFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<footer>
  <div class="footer-inner">
    <div>
      <a href="/" class="footer-brand" style="color:var(--wh)">The Wilder House</a>
      <p class="footer-tagline">Built in 1898. Preserved for your stories.</p>
      <address class="footer-contact">
        <p>314 East Park Avenue<br>Savannah, Georgia 31401</p>
        <p style="margin-top:8px"><a href="tel:+19122317502">(912) 231-7502</a></p>
        <p><a href="mailto:info@ForsythParkVacationRental.com">info@ForsythParkVacationRental.com</a></p>
      </address>
      <div style="display:flex;gap:14px;margin-top:16px">
        <a href="https://www.pinterest.com/Forsyth_Park_Vacation_Rentals" target="_blank" rel="nofollow noopener noreferrer" aria-label="Pinterest" style="color:rgba(255,255,255,.6);display:inline-flex;align-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.1-.95-.2-2.4.04-3.44.22-.94 1.41-5.97 1.41-5.97s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 4-.28 1.19.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.89 2.74.1.12.11.22.08.34l-.33 1.36c-.05.22-.17.27-.4.16-1.5-.7-2.44-2.89-2.44-4.65 0-3.78 2.75-7.26 7.93-7.26 4.16 0 7.4 2.97 7.4 6.93 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.15.83.25 1.71.39 2.62.39 6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg></a>
        <a href="https://www.facebook.com/profile.php?id=100092371461053" target="_blank" rel="nofollow noopener noreferrer" aria-label="Facebook" style="color:rgba(255,255,255,.6);display:inline-flex;align-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.44 18.63 0 12 0S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z"/></svg></a>
        <a href="https://www.instagram.com/the_wilder_house_forsyth_park/" target="_blank" rel="nofollow noopener noreferrer" aria-label="Instagram" style="color:rgba(255,255,255,.6);display:inline-flex;align-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12c0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.01 4.95-.07 4.35-.2 6.78-2.62 6.98-6.98C23.99 15.67 24 15.26 24 12c0-3.26-.01-3.67-.07-4.95-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a>
      </div>
    </div>
    <div class="footer-col">
      <p class="footer-col-head" style="font-size:.64rem;letter-spacing:3px;text-transform:uppercase;color:var(--footer-label);margin-bottom:14px;font-weight:700">Suites</p>
      <ul>
        <li><a href="forsyth-park-vacation-rental-savannah-314a">Suite 314A</a></li>
        <li><a href="savannah-victorian-district-vacation-rental-316a">Suite 316A</a></li>
        <li><a href="savannah-group-vacation-rental-4-bedroom">Book Both</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <p class="footer-col-head" style="font-size:.64rem;letter-spacing:3px;text-transform:uppercase;color:var(--footer-label);margin-bottom:14px;font-weight:700">The Property</p>
      <ul>
        <li><a href="wilder-house-savannah-vacation-rental">Our Story</a></li>
        <li><a href="savannah-victorian-district">Location</a></li>
        <li><a href="savannah-vacation-rental-with-parking">Parking</a></li>
        <li><a href="house-rules">House Rules</a></li>
        <li><a href="contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <p class="footer-col-head" style="font-size:.64rem;letter-spacing:3px;text-transform:uppercase;color:var(--footer-label);margin-bottom:14px;font-weight:700">Plan Your Trip</p>
      <ul>
        <li><a href="savannah-st-patricks-day-vacation-rental">St. Patrick's Day</a></li>
        <li><a href="family-vacation-rental">Family</a></li>
        <li><a href="savannah-farmers-market">Farmers Market</a></li>
        <li><a href="historic-savannah-vacation-rental">Historic</a></li>
        <li><a href="savannah-romantic-vacation-rental">Romantic</a></li>
        <li><a href="savannah-day-planner">Live Planner</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <p class="footer-col-head" style="font-size:.64rem;letter-spacing:3px;text-transform:uppercase;color:var(--footer-label);margin-bottom:14px;font-weight:700">Guest Info</p>
      <ul>
        <li><span style="color:rgba(255,255,255,.8);font-size:.86rem">Check-in: 4 PM</span></li>
        <li><span style="color:rgba(255,255,255,.8);font-size:.86rem">Checkout: 11 AM</span></li>
        <li><a href="reviews">Guest Reviews</a></li>
        <li><a href="submit-review">Leave a Review</a></li>
        <li><a href="privacy-policy">Privacy Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="fbot">
    <p>&copy; 2026 <a href="/" style="color:inherit;text-decoration:none">ForsythParkVacationRentals.com</a> &middot; Savannah, Georgia</p>
    <p><a href="/" style="color:inherit;text-decoration:none">The Wilder <span style="color:var(--gol)">House</span></a> &middot; Est. 1898</p>
  </div>
</footer>`;
  }
}

// Register components
if (!customElements.get('shared-header')) customElements.define('shared-header', SharedHeader);
if (!customElements.get('shared-footer')) customElements.define('shared-footer', SharedFooter);
