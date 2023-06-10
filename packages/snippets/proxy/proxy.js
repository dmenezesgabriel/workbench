// Target object
const target = {
  name: "John",
  age: 30,
};

// Proxy object
const handler = {
  get: function (target, prop) {
    if (prop === "age") {
      return `Age: ${target[prop]}`; // Modify the returned value
    }
    return target[prop];
  },
  set: function (target, prop, value) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    target[prop] = value;
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // Output: John
console.log(proxy.age); // Output: Age: 30

proxy.age = 35; // Update the age
console.log(proxy.age); // Output: Age: 35

proxy.age = "thirty"; // Throws an error: Age must be a number
