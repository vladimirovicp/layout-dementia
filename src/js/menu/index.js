console.log('nav');


const header = document.querySelector('header.header');
if(header){
    const nav = header.querySelector('.header__nav'); 
    if(nav){
        const menuBtn = nav.querySelector('.header__nav-wrapper');
        menuBtn.addEventListener('click', () => menuClick(nav,header));
    }
   
}

function menuClick(nav, header){
    const navMenu = nav.querySelector('.header__nav-menu');
    const icoBurger = nav.querySelector('.header__nav-hamburger')
    navMenu.classList.toggle('_active');
    icoBurger.classList.toggle('_active');

    const container = header.querySelector('.container');
    container.classList.toggle('_menu-active');
}
