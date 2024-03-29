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
    try {
      let elem = elems[y][x];
      if (!has_children.has({ xindex: x, yindex: y })) {
        random_elem =
          possible_options[Math.floor(Math.random() * possible_options.length)];
        elem.innerHTML = random_elem[0];
        elem.style.backgroundColor = random_elem[1];
      }
    } catch (e) {}
  }
}

// function to parse run length encoding
const parse_rle = (rle_frame, width) => {
  let one_dimension = [];
  let n = "";
  for (let i = 0; i < rle_frame.length; i++) {
    if (rle_frame[i] == "W" || rle_frame[i] == "B") {
      // add the number to the one_dimension array
      for (let j = 0; j < parseInt(n); j++) {
        one_dimension.push(rle_frame[i] == "W" ? 1 : 0);
      }
      n = "";
    } else {
      n += rle_frame[i];
    }
  }
  let two_dimension = [];
  for (let i = 0; i < one_dimension.length; i += width) {
    two_dimension.push(one_dimension.slice(i, i + width));
  }
  return two_dimension;
};

// console.log(has_children);

let XSIZE = 15;
let YSIZE = 15;

let url = `https://raw.githubusercontent.com/flatypus/myedbadapple/master/binary${
  8 * XSIZE
}x${9 * YSIZE}.txt`;
let response = await fetch(url);
let data = await response.text();
let binary_data = data.split("\n");
let parsed_binary_data = binary_data.map((frame) =>
  parse_rle(frame, 8 * XSIZE)
);

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
    try {
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
            td.style.fontSize = "2px";
            td.style.paddingTop = "8px";
            td.style.paddingBottom = "8px";
            td.style.border = "1px solid transparent";
            td.style.backgroundColor = elem.style.backgroundColor;
            td.style.textAlign = "center";
            td.innerHTML = innerHTML;
            td.innerText = innerText;
            td.style.color = "transparent";
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
        elem.appendChild(table);
        // absolutely position a text in the center of the table
        let text = document.createElement("div");
        text.style.position = "absolute";
        text.style.top = "50%";
        text.style.left = "50%";
        text.style.transform = "translate(-50%, -50%)";
        text.style.fontSize = "48px";
        text.innerText = innerText;
        elem.style.position = "relative";
        elem.appendChild(text);
      }, 30 * (y * 8 + x));
    } catch (e) {}
  }
}

setTimeout(() => {
  let frame = 0;
  let interval = setInterval(() => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 8; x++) {
        try {
          let elem = elems[y][x];
          let table = elem.children[0];
          let number_of_blacks = 0;

          for (let i = 0; i < YSIZE; i++) {
            for (let j = 0; j < XSIZE; j++) {
              let td = table.children[i].children[j];
              if (parsed_binary_data[frame][y * XSIZE + i][x * YSIZE + j]) {
                //   td.style.backgroundColor = "white";
                //  set it to the original color
                td.style.backgroundColor = td.children[0].style.backgroundColor;
              } else {
                td.style.backgroundColor = "black";
                number_of_blacks += 1;
              }
            }
          }
          if (number_of_blacks > (XSIZE * YSIZE) / 2) {
            // set text to white
            elem.children[1].style.color = "white";
          } else {
            elem.children[1].style.color = "black";
          }
        } catch (e) {}
      }
    }
    if (frame >= binary_data.length - 1) {
      clearInterval(interval);
    }
    frame++;
  }, 66);
}, 850);
