import "./assets/style.css";
import Worker from "worker-lib/worker?worker";

document.querySelector("#app").innerHTML = `
  <h1>Web Worker example</h1>

  <div class="controls" tabindex="0">
    <form>
      <div>
        <label for="number1">Multiply number 1: </label>
        <input type="text" id="number1" value="0" />
      </div>
      <div>
        <label for="number2">Multiply number 2: </label>
        <input type="text" id="number2" value="0" />
      </div>
    </form>

    <p class="result">Result: <span class="result__value">0</span></p>
  </div>
`;

const first = document.querySelector("#number1");
const second = document.querySelector("#number2");

const result = document.querySelector(".result__value");

if (window.Worker) {
  const myWorker = new Worker({
    type: "module",
  });

  first.onchange = function () {
    console.log("Message posted to worker");
    myWorker.postMessage([first.value, second.value]);
  };

  second.onchange = function () {
    console.log("Message posted to worker");
    myWorker.postMessage([first.value, second.value]);
  };

  myWorker.onmessage = function (e) {
    console.log("Message received from worker");
    result.textContent = e.data;
  };
} else {
  console.log("Your browser doesn't support web workers.");
}
