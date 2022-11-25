let buttons = document.getElementsByClassName("pixel2");
let background = document.getElementsByClassName("background")[0];

let prev = 0;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mouseover', () => {
    const name = buttons[i].children[0].textContent;
    if (prev !== i) {

      if (i === 0)
        background.setAttribute("src", "./steckbrief/starfox-preview.webm");
      else
        background.setAttribute("src", `./steckbrief/${name}-preview.webm`);

      prev = i;
    }
  });
}