function binarySearchObjects(arr, searchObj) {
  arr.sort((a, b) => {
    // Sort by all object properties
    for (let key in a) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const currentObj = arr[mid];

    let match = true;
    for (let key in searchObj) {
      if (currentObj[key] !== searchObj[key]) {
        match = false;
        break;
      }
    }

    if (match) {
      return currentObj; // Found a matching object
    } else if (currentObj > searchObj) {
      high = mid - 1; // Continue searching in the left half
    } else {
      low = mid + 1; // Continue searching in the right half
    }
  }

  return null; // Object not found
}

const people = [
  { name: "John", age: 25, city: "New York" },
  { name: "Jane", age: 30, city: "Los Angeles" },
  { name: "Bob", age: 28, city: "Chicago" },
  { name: "Alice", age: 25, city: "New York" },
];

const searchObj = { age: 25, city: "New York" };
const foundPerson = binarySearchObjects(people, searchObj);

console.log(foundPerson);
