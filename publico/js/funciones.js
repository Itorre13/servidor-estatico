const h1 = document.querySelector("h1");

h1.innerHTML = h1.innerText.split("").map(c => {
    return `<span style="color:rgb(${[0,0,0].map(() => Math.floor(Math.random() * 256)).join(",")})">${c}</span>`
}).join("");