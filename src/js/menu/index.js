console.log('nav');


const header = document.querySelector('header.header');
if(header){
    const nav = header.querySelector('.header__nav'); 
    if(nav){
        const menuBtn = nav.querySelector('.header__nav-wrapper');
        menuBtn.addEventListener('click', () => menuClick(nav));
    }
   
}

function menuClick(nav){
    const navMenu = nav.querySelector('.header__nav-menu');
    const icoBurger = nav.querySelector('.header__nav-hamburger')
    navMenu.classList.toggle('_active');
    icoBurger.classList.toggle('_active');
}
