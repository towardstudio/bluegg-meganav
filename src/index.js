/*
        (                                                   
   (    )\ )                 (        (                     
 ( )\  (()/(      (    (     )\ )     )\ )                  
 )((_)  /(_))     )\   )\   (()/(    (()/(                  
((_)_  (_))    _ ((_) ((_)   /(_))_   /(_))_                
 | _ ) | |    | | | | | __| (_)) __| (_)) __|               
 | _ \ | |__  | |_| | | _|    | (_ |   | (_ |               
 |___/ |____|  \___/  |___|    \___|    \___|               
   *                                  )                     
 (  `           (          (       ( /(     (               
 )\))(    (     )\ )       )\      )\())    )\      (   (   
((_)()\   )\   (()/(    ((((_)(   ((_)\  ((((_)(    )\  )\  
(_()((_) ((_)   /(_))_   )\ _ )\   _((_)  )\ _ )\  ((_)((_) 
|  \/  | | __| (_)) __|  (_)_\(_) | \| |  (_)_\(_) \ \ / /  
| |\/| | | _|    | (_ |   / _ \   | .` |   / _ \    \ V /   
|_|  |_| |___|    \___|  /_/ \_\  |_|\_|  /_/ \_\    \_/    
																													
© Bluegg

*/


function meganav(
	optsNav = '[data-meganav]',
	optsToggle = '[data-meganav-toggle]',
	optsActiveClass = 'is-active',
	hover = false,
	optsHoverClass = 'is-hover'
) {

	const NAV = document.querySelector(optsNav);
	const NAV_LI = NAV.querySelectorAll('li');

	const NAV_TOGGLE = NAV.querySelector(optsToggle);

	const ACTIVE_CLASS = optsActiveClass;
	const HOVER_CLASS = optsHoverClass;

	const KEYS = {
		ESC: 27,
		TAB: 9,
		ENTER: 13,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	};

	// ALL LIS with SUBNAV
	const LI_HAS_SUB = [].filter.call(NAV_LI, (li) => {
		return li.querySelector('ul')
	})

	// ALL LINKS with SUBNAV
	const LINK_HAS_SUB = LI_HAS_SUB.map((li) => {
		return li.querySelector('a[href]');
	})

	// GET ALL THE BACK BUTTONS 
	const BACK_BUTTONS = LI_HAS_SUB.map((li) => {
		return li.querySelector('button');
	})

	// JUST IN CASE WE FORGOT, SET THE ARIA ATTRIBUTES FOR THE LINKS
	LINK_HAS_SUB.forEach((link) => {
		link.setAttribute('aria-haspopup', 'true');
		link.setAttribute('aria-expanded', 'false');
	})

	// WE MAINTAIN A STACK OF CURRENTLY ACTIVE NAVS. THIS HELPS TO MANAGE THINGS LIKE FOCUS, AND ALSO MEANS WE CAN CHECK WHAT NAVS NEED TO BE OPEN/CLOSED WHEN WE NEED TO. 

	// TO START, WE JUST SET THE TOP LEVEL MENU AS THE ACTIVE NAV
	let activeMenu = [NAV.querySelector('ul')];

	// LISTEN FOR KEYUPS
	window.addEventListener('keyup', handleKeyup, false);

	// LISTEN FOR CLICKS
	window.addEventListener('click', handleClickOutside, false);
	window.addEventListener('touchend', handleClickOutside, false);

	if (hover) {
		// BIND EVENT LISTENERS TO HANDLE HOVERING
		LI_HAS_SUB.forEach(li => {
			li.addEventListener('mouseenter', handleHover, false);
			li.addEventListener('mouseleave', handleHover, false);
		});
	}

	// BIND EVENT LISTENERS FOR CLICKS AND TAPS ON LINKS WITH SUB MENUS
	LINK_HAS_SUB.forEach(link => {
		link.addEventListener('click', handleClick, false);
		
	});

	// BIND EVENT LISTENERS FOR CLICKS AND TAPS ON BACK BUTTONS
	BACK_BUTTONS.forEach(btn => {
		btn.addEventListener('click', handleBack, false);
	});

	NAV_TOGGLE.addEventListener('click', handleNavToggle, false);

	function handleNavToggle(e) {
		let toggle = e.target;
		let topMenu = NAV.querySelector('ul');
		let expanded = toggle.getAttribute('aria-expanded');

		if (expanded === 'true') {
			toggle.setAttribute('aria-expanded', 'false');
			toggle.focus();
		} else {
			toggle.setAttribute('aria-expanded', 'true');
			topMenu.querySelector('a[href]').focus()
		}

	}

	function handleClickOutside(e) {
		var isClickInside = NAV.contains(e.target);

		if (!isClickInside) {
			LINK_HAS_SUB.forEach(link => {
				link.classList.remove(ACTIVE_CLASS);
				link.setAttribute('aria-expanded', 'false');
			});

			NAV_TOGGLE.setAttribute('aria-expanded', 'false');

			if (activeMenu.length > 1) {
				LINK_HAS_SUB[0].focus();
				activeMenuPop()
				if (activeMenu.length > 1) {
					activeMenuPop()
				}
			}

		} else {
			return
		}
	}

	function activeMenuPop() {
		return activeMenu.pop();
	}

	function handleBack(e) {
		// THE BACK BTN
		let btn = e.target;
		// THE NEAREST LI
		let parentEl = btn.parentElement;
		// THE PARENT MENU
		let grandParentEl = parentEl.parentElement;
		// THE MAIN LI WITH THE LINK WE NEED TO CLOSE THE MENU
		let greatGrandParentEl = grandParentEl.parentElement;

		// Remove the menu from the active menu stack
		activeMenuPop();

		// Deactivate all the links/menus in this tree
		[].forEach.call(greatGrandParentEl.querySelectorAll('[aria-haspopup]'), (link) => {
			link.classList.remove(ACTIVE_CLASS);
			link.setAttribute('aria-expanded', 'false');
		});

		greatGrandParentEl.querySelector('[aria-haspopup]').focus();

	}

	// WHEN WE GET A CLICK
	function handleClick(e) {

		e.preventDefault(); // Stop link from navigating

		// IS THE MENU OPEN?
		let expanded = e.target.getAttribute('aria-expanded');

		// IT IS...
		if (expanded === 'true') {

			// CLOSE THE SUBMENU
			let parentEl = e.target.parentElement;

			// Deactivate the link
			e.target.classList.remove(ACTIVE_CLASS);
			e.target.setAttribute('aria-expanded', 'false');

			// Remove the menu from the active menu stack
			activeMenuPop();

			// Deactivate all the links/menus in this tree
			[].forEach.call(parentEl.querySelectorAll('[aria-haspopup]'), (link) => {
				link.classList.remove(ACTIVE_CLASS);
				link.setAttribute('aria-expanded', 'false');
			});
		
		// ITS NOT OPEN...
		} else {

			// OPEN THE SUBMENU

			// *extreme east-end voice: FAAMLEEEH
			let parentEl = e.target.parentElement;
			let grandParentEl = parentEl.parentElement;
			let siblingLIs = grandParentEl.children;

			// This will show the nav
			e.target.classList.add(ACTIVE_CLASS);
			// This will let screen readers know it opened
			e.target.setAttribute('aria-expanded', 'true');
			NAV_TOGGLE.setAttribute('aria-expanded', 'true');
			
			// Check whether the current active nav is in the same tree
			if (grandParentEl !== activeMenu[activeMenu.length-1]) {
				// if not remove the deepest nav
				activeMenuPop();

				// Now check again, if we're *still* not in the tree remove the next deepest
				if (grandParentEl !== activeMenu[activeMenu.length-1]) {
					activeMenuPop();
				}
			}
			
			// Now push the latest live nav to the bottom 
			activeMenu.push(parentEl.querySelector('ul'));

			// Focus the first link in that nav (this is the expected accessible behaviour)
			activeMenu[activeMenu.length-1].querySelector('a').focus();
			
			
			// Loop over all the sibling LIs
			[].forEach.call(siblingLIs, (li) => {
				
				// Get the other links at this level
				let link = li.querySelector('a[href], button:not(:disabled)');

				// Check that we aren't on the current link
				if (link !== e.target) {
					// If not deactivate it
					link.classList.remove(ACTIVE_CLASS);
					link.setAttribute('aria-expanded', 'false');
					
					// If the link has a submenu
					if (link.nextElementSibling) {
						// Loop over links in that submenu and ensure they are all closed
						[].forEach.call(link.nextElementSibling.querySelectorAll('[aria-haspopup]'), (link) => {
							link.classList.remove(ACTIVE_CLASS);
							link.setAttribute('aria-expanded', 'false');
						});

					}
				}

				return
			});

		}

	}

	// HANDLE KEYUPS
	function handleKeyup(e) {

		// WHEN SOMEONE IS TABBING THROUGH...
		if (e.which === KEYS.TAB) {

			// GET THE DEEPEST MENU ITEM
			let menu = activeMenu.slice(-1)[0];
			// GET THE TRIGGER LINK
			let link = menu ? menu.parentElement.querySelector(`[aria-haspopup]`) : null;

			if (!menu) {
				return
			} 
			// ... AND THE MENU DOES NOT CONTAIN THE CURRENT FOCUSED LINK
			if (!menu.contains(e.target)) {
				
				// DEACTIVATE THE MENU
				link.classList.remove(ACTIVE_CLASS);
				link.setAttribute('aria-expanded', 'false')

				if (activeMenu.length > 1) {
					// POP THE ACTIVE MENU OFF THE STACK
					activeMenuPop();
				}
			} 

		}

		// WHEN SOMEONE IS TRYING TO ESCAPE...
		if (e.which === KEYS.ESC) {

			// GET THE DEEPEST MENU ITEM
			let menu = activeMenu.slice(-1)[0];
			// GET THE TRIGGER LINK
			let link = menu ? menu.parentElement.querySelector(`[aria-haspopup]`) : null;

			// IF THERE IS NO MENU< GET OUT OF HERE
			if (!menu) {
				return
			} else {
				// IF THERE IS *AND* IT HAS THE CURRENT TARGET INSIDE IT...
				if (menu.contains(e.target)) {
					// DEACTIVATE THE MENU
					link.classList.remove(ACTIVE_CLASS);
					link.setAttribute('aria-expanded', 'false')
					link.focus();
					// POP THE ACTIVE MENU OFF THE STACK, IF ITS NOT THE MAIN MENU
					if (activeMenu.length > 1) {
						activeMenuPop();
					} 
				}
			}

		}

	}

	// WE ARE FLOATING
	function handleHover() {
		let classes = this.classList
		
		// JUST ADD OR REMOVE THE CLASSES
		if (classes.contains(HOVER_CLASS)) {
			classes.remove(HOVER_CLASS);
		} else {
			classes.add(HOVER_CLASS);
		}

		// NOTE: WE ADD A DELAY IN CSS TO MANAGE USER NOT QUITE HOVERING OVER THE ITEM. THIS IS IMPERECT
		// TODO: ADD A JS DELAY TO THE HOVER (WHICH WORKS FOR NEXTED MENUS)
	}

}

export default meganav;