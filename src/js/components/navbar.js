export function navbar() {
	var t = this
	t.n = document.querySelector('nav')
	t.close = function () {
		document.body.style.overflow = 'auto'
		t.n.classList.remove('active')
	}
	t.open = function () {
		document.body.style.overflow = 'hidden'
		t.n.classList.add('active')
	}
	if (t.n) {
		const btn = document.querySelector('nav>button')
		if (btn) {
			btn.addEventListener('click', () => {
				if (t.n.classList.contains('active')) t.close()
				else t.open()
			})
		}
		const overlay = document.querySelector('nav>.nav-overlay')
		if (overlay) {
			overlay.addEventListener('click', () => {
				t.close()
			})
		}
		document.querySelectorAll('nav ul a').forEach((n) =>
			n.addEventListener('click', () => {
				t.close()
			})
		)
	}
}
