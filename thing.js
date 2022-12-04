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

let url =
  "https://raw.githubusercontent.com/flatypus/myedbadapple/master/binary8x9.txt";
let response = await fetch(url);
let data = await response.text();
let binary_data = JSON.parse(data);
// console.log(binary_data);

// // play the song
// var audio = new Audio(
//   "https://github.com/flatypus/myedbadapple/raw/master/badapple.mp3"
// );
// audio.volume = 0.3;
// audio.play();

// calibration:
// for (let y = 0; y < 9; y++) {
//   for (let x = 0; x < 8; x++) {
//     setTimeout(() => {
//       let elem = elems[y][x];
//       elem.style.backgroundColor = "black";
//     }, 30 * (y * 8 + x));
//   }
// }

setTimeout(() => {
  let frame = 0;
  let interval = setInterval(() => {
    console.log(binary_data[frame].map((e) => e.join("")).join("\n"));
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 8; x++) {
        //   console.log(binary_data[frame][y][x], elems[y][x], x, y);
        // if (binary_data[frame][y][x] == 1) {
        //   elems[y][x].style.backgroundColor = "white";
        // } else {
        // elems[y][x].style.backgroundColor = "black";
        // }
        elems[y][x].innerText = binary_data[frame][y][x] == 1 ? "■" : "□";
      }
    }
    if (frame >= binary_data.length - 1) {
      clearInterval(interval);
    }
    frame++;
  }, 1000 / 30);
}, 0);

// console.log(elems);
