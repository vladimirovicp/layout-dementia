console.log('Привет!!!');
// import "./lib/app";

console.log('Привет!');

// $(".progress span").each(function () {
//   $(this).animate(
//     {
//       width: $(this).attr("data-progress") + "%",
//     },
//     1000
//   );
//   $(this).text($(this).attr("data-progress") + "%");
// });

document.addEventListener('DOMContentLoaded', function () {
  // Получаем все элементы span внутри элементов с классом progress
  var progressSpans = document.querySelectorAll('.progress-bar');

  // Перебираем каждый элемент span
  progressSpans.forEach(function (span) {
    // Получаем значение data-progress
    // const progress = span.getAttribute('data-progress');

    // // Устанавливаем ширину и текст
    // span.style.width = progress + '%';
    // //span.textContent = progress + '%';

    // const parent = span.parentElement;
    // const progressText = progress + '%';
    //  parent.appendChild(progressText);

    var progress = span.getAttribute('data-progress');

    // Устанавливаем ширину для span
    span.style.width = progress + '%';

    // Создаем новый элемент для отображения текста
    var progressText = document.createElement('div');
    progressText.className = 'progress__number';
    progressText.textContent = progress + '%';

    // Добавляем текстовый элемент в родителя
    var parent = span.parentElement;
    parent.appendChild(progressText);
  });
});

//# sourceMappingURL=main.js.map