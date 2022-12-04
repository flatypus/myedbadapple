// get the element itself, since that's our entrypoint
listGridFixed = document.getElementsByClassName("listGridFixed")[0];
// certified BC education html moment
table =
  listGridFixed.children[0].children[0].children[0].children[0].children[0]
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
// now we have a list of 9x8=72 elements
let binary_data = fetch(
  "https://github.com/flatypus/myedbadapple/blob/master/binary.txt?raw=true"
).then((res) => JSON.parse(res.text()));
print(binary_data);
