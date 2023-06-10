# Javascript Proxy

1. Validation and Type Checking:

   ```javascript
   const target = {
     age: 25,
   };

   const handler = {
     set: function (target, prop, value) {
       if (prop === "age" && typeof value !== "number") {
         throw new TypeError("Age must be a number");
       }
       target[prop] = value;
     },
   };

   const proxy = new Proxy(target, handler);

   proxy.age = 30; // Valid assignment
   console.log(proxy.age); // Output: 30

   proxy.age = "thirty"; // Throws an error: Age must be a number
   ```

2. Object Property Access Control:

   ```javascript
   const target = {
     name: "John",
     age: 30,
     isAdmin: false,
   };

   const handler = {
     get: function (target, prop) {
       if (prop === "isAdmin") {
         // Only allow access to the isAdmin property if the user is an admin
         if (userIsAdmin()) {
           return target[prop];
         } else {
           throw new Error("Access denied");
         }
       }
       return target[prop];
     },
   };

   const proxy = new Proxy(target, handler);

   console.log(proxy.name); // Output: John
   console.log(proxy.age); // Output: 30

   console.log(proxy.isAdmin); // Throws an error: Access denied (if userIsAdmin() returns false)
   ```

3. Logging and Debugging:

   ```javascript
   const target = {
     name: "John",
     age: 30,
   };

   const handler = {
     get: function (target, prop) {
       console.log(`Getting property: ${prop}`);
       return target[prop];
     },
   };

   const proxy = new Proxy(target, handler);

   console.log(proxy.name); // Output: Getting property: name, John
   console.log(proxy.age); // Output: Getting property: age, 30
   ```

4. Caching and Memoization:

   ```javascript
   const target = {
     expensiveCalculation: function () {
       // Perform expensive calculation here
       console.log("Performing expensive calculation...");
       return Math.random();
     },
   };

   const cache = new Map();

   const handler = {
     get: function (target, prop) {
       if (prop === "expensiveCalculation") {
         if (!cache.has(prop)) {
           const result = target[prop]();
           cache.set(prop, result);
           return result;
         }
         return cache.get(prop);
       }
       return target[prop];
     },
   };

   const proxy = new Proxy(target, handler);

   console.log(proxy.expensiveCalculation()); // Output: Performing expensive calculation..., random number
   console.log(proxy.expensiveCalculation()); // Output: random number (cached result)
   ```

5. Dynamic Objects and Virtual Properties:

   ```javascript
   const target = {};

   const handler = {
     get: function (target, prop) {
       if (prop === "dynamicProperty") {
         return "This is a dynamically generated property";
       }
       return target[prop];
     },
   };

   const proxy = new Proxy(target, handler);

   console.log(proxy.dynamicProperty); // Output: This is a dynamically generated property
   ```

6. Immutable Objects:

   ```javascript
   const target = {
     name: "John",
   };

   const handler = {
     set: function (target, prop, value) {
       throw new Error("Cannot modify properties of an immutable object");
     },
   };

   const proxy = new Proxy(target, handler);

   proxy.name = "Jane"; // Throws an error: Cannot modify properties of an immutable object
   ```

7. Observing Object Changes:

   ```javascript
   const target = {
     name: "John",
     age: 30,
   };

   const handler = {
     set: function (target, prop, value) {
       console.log(
         `Property '${prop}' changed from ${target[prop]} to ${value}`
       );
       target[prop] = value;
     },
   };

   const proxy = new Proxy(target, handler);

   proxy.name = "Jane"; // Output: Property 'name' changed from John to Jane
   proxy.age = 35; // Output: Property 'age' changed from 30 to 35
   ```

These examples demonstrate various ways you can utilize the Proxy API to intercept and customize object operations in JavaScript.
