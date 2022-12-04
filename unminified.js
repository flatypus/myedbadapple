// get the element itself, since that's our entrypoint
list_grid_fixed = document.getElementsByClassName("listGridFixed")[0];
// certified BC education html moment
table =
  list_grid_fixed.children[0].children[0].children[0].children[0].children[0]
    .children[0];
// table is now a list of trs
// we only edit the second row and below, and second column and after that
// convert table.children into an array using Array.from()
let elems = [];
Array.from(table.children).forEach((row, yindex) => {
  if (yindex > 0) {
    rowlist = [];
    Array.from(row.children).forEach((col, xindex) => {
      if (xindex > 0) {
        rowlist.push(col);
      }
    });
    elems.push(rowlist);
  }
});
console.log(elems);
// now we have a list of 8x9=72 elements

let has_children = new Map();
let possible_options = [];
elems.forEach((row, yindex) => {
  row.forEach((col, xindex) => {
    if (col.children.length > 0) {
      has_children.set({ xindex, yindex }, col.innerHTML);
      possible_options.push([col.innerHTML, col.style.backgroundColor]);
    }
  });
});

for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 8; x++) {
    let elem = elems[y][x];
    if (!has_children.has({ xindex: x, yindex: y })) {
      random_elem =
        possible_options[Math.floor(Math.random() * possible_options.length)];
      elem.innerHTML = random_elem[0];
      elem.style.backgroundColor = random_elem[1];
    }
  }
}

// console.log(has_children);

let XSIZE = 3;
let YSIZE = 3;

let url = `https://raw.githubusercontent.com/flatypus/myedbadapple/master/binary${
  8 * XSIZE
}x${9 * YSIZE}.txt`;
let response = await fetch(url);
let data = await response.text();
let binary_data = JSON.parse(data);
// console.log(binary_data);

// play the song
var audio = new Audio(
  "https://github.com/flatypus/myedbadapple/raw/master/badapple.mp3"
);
audio.volume = 0.3;
setTimeout(() => {
  audio.play();
}, 2170);

// calibration:
for (let y = 0; y < 9; y++) {
  for (let x = 0; x < 8; x++) {
    setTimeout(() => {
      let elem = elems[y][x];
      let innerText = elem.children[0].innerText;
      let innerHTML = elem.innerHTML;
      elem.innerText = "";
      elem.innerHTML = "";
      let table = document.createElement("table");
      table.style.width = "100%";
      table.style.height = "100%";
      table.style.borderCollapse = "collapse";
      for (let i = 0; i < YSIZE; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < XSIZE; j++) {
          let td = document.createElement("td");
          td.style.width = `${Math.floor(100 / XSIZE)}%`;
          td.style.height = `${Math.floor(100 / YSIZE)}%`;
          td.style.border = "1px solid black";
          td.style.backgroundColor = elem.style.backgroundColor;
          td.style.textAlign = "center";
          td.innerHTML = innerHTML;
          td.innerText = innerText;
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      elem.appendChild(table);
    }, 30 * (y * 8 + x));
  }
}

setTimeout(() => {
  let frame = 0;
  let interval = setInterval(() => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 8; x++) {
        let elem = elems[y][x];
        let table = elem.children[0];
        for (let i = 0; i < YSIZE; i++) {
          for (let j = 0; j < XSIZE; j++) {
            let td = table.children[i].children[j];
            if (binary_data[frame][y * XSIZE + i][x * YSIZE + j] == 1) {
              //   td.style.backgroundColor = "white";
              //  set it to the original color
              td.style.backgroundColor = td.children[0].style.backgroundColor;
            } else {
              td.style.backgroundColor = "black";
            }
          }
        }
      }
    }
    if (frame >= binary_data.length - 1) {
      clearInterval(interval);
    }
    frame++;
  }, 1000 / 10);
  // originally there was a nonzero number there, but i added the calibration and now it's just instantly run
}, 0);
