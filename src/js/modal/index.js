const body = document.querySelector('body');
const modalBg = document.querySelector('.modal__bg');

if(modalBg){
    const modal = modalBg.querySelector('.modal');

    if(modal){

        const modalOpenBtn = document.querySelector('.modal-open');

        if(modalOpenBtn){
            modalOpenBtn.addEventListener('click', () => modalOpen(modal,modalBg));
        }

        const modalCloseBtn = modal.querySelector('.modal__close');
        modalCloseBtn.addEventListener('click', ()=> modalClose(modal,modalBg));
    }
}

function modalClose(modal,modalBg){
    modalBg.classList.remove('active');
    modal.classList.remove('active');
    body.classList.remove('_lock');
       
}

function modalOpen(modal,modalBg){
    modalBg.classList.add('active');
     modal.classList.add('active');
     body.classList.add('_lock');

     

     document.onclick = function (e) {
        if(e.target.className == "modal__bg active"){
            modalBg.classList.remove('active');
            modal.classList.remove('active');
            body.classList.remove('_lock');
        }

        if( e.target.className == "footer__modal-bg active"){
            modalBg.classList.remove('active');
            modal.classList.remove('active');
            body.classList.remove('_lock');
        }
    };
}

const footerModalBg = document.querySelector('.footer__modal-bg');

if(footerModalBg){
    const footerModal = footerModalBg.querySelector('.footer__modal');
    if(footerModal){

        const footerModalOpenBtn = document.querySelector('.footer__modal-open');

        if(footerModalOpenBtn){
            footerModalOpenBtn.addEventListener('click', () => modalOpen(footerModal,footerModalBg));
        }

        const modalCloseBtn = footerModal.querySelector('.modal__close');
        modalCloseBtn.addEventListener('click', ()=> modalClose(footerModal,footerModalBg));
    }
}