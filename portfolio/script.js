const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const revealItems = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const yearNode = document.getElementById('year');
const scrollProgressBar = document.getElementById('scrollProgressBar');

const syncNavbarState = () => {
	navbar.classList.toggle('scrolled', window.scrollY > 24);
};

const syncScrollProgress = () => {
	if (!scrollProgressBar) {
		return;
	}

	const scrollTop = window.scrollY;
	const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = documentHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100)) : 0;
	scrollProgressBar.style.width = `${progress}%`;
};

const closeMenu = () => {
	menuToggle.classList.remove('is-open');
	menuToggle.setAttribute('aria-expanded', 'false');
	navLinks.classList.remove('is-open');
};

const openMenu = () => {
	menuToggle.classList.add('is-open');
	menuToggle.setAttribute('aria-expanded', 'true');
	navLinks.classList.add('is-open');
};

menuToggle?.addEventListener('click', () => {
	const isOpen = navLinks.classList.contains('is-open');
	if (isOpen) {
		closeMenu();
		return;
	}

	openMenu();
});

navAnchors.forEach((anchor) => {
	anchor.addEventListener('click', () => {
		if (window.innerWidth <= 760) {
			closeMenu();
		}
	});
});

const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			const currentId = entry.target.getAttribute('id');
			navAnchors.forEach((anchor) => {
				anchor.classList.toggle('active', anchor.getAttribute('href') === `#${currentId}`);
			});
		});
	},
	{
		threshold: 0.45,
		rootMargin: '-15% 0px -35% 0px'
	}
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		});
	},
	{
		threshold: 0.2
	}
);

revealItems.forEach((item) => revealObserver.observe(item));

contactForm?.addEventListener('submit', (event) => {
	event.preventDefault();

	const data = new FormData(contactForm);
	const name = String(data.get('name') || '').trim();

	formStatus.textContent = name
		? `Thanks, ${name}. Your message is queued for follow-up.`
		: 'Thanks. Your message is queued for follow-up.';

	contactForm.reset();
});

yearNode.textContent = new Date().getFullYear();
syncNavbarState();
syncScrollProgress();
window.addEventListener('scroll', syncNavbarState, { passive: true });
window.addEventListener('scroll', syncScrollProgress, { passive: true });
window.addEventListener('resize', () => {
	if (window.innerWidth > 760) {
		closeMenu();
	}

	syncScrollProgress();
});
