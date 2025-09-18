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
}
