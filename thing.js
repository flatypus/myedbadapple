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
let url =
  "https://raw.githubusercontent.com/flatypus/myedbadapple/master/binary.txt";
let response = await fetch(url);
let data = await response.text();
let binary_data = JSON.parse(data);
// console.log(binary_data);
let frame = 0;
setInterval(() => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 8; x++) {
      //   console.log(binary_data[frame][y][x], elems[y][x], x, y);
      if (binary_data[frame][y][x] == 1) {
        elems[y][x].style.backgroundColor = "black";
      } else {
        elems[y][x].style.backgroundColor = "white";
      }
    }
  }
  frame++;
}, 1000 / 30);
